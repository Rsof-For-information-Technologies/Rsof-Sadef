using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.ContactDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Services.Contact;
using Sadef.Application.Services.Multilingual;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Domain.Constants;
using Sadef.Domain.ContactEntity;
using Sadef.Domain.PropertyEntity;
using Sadef.Domain.Users;
using Sadef.Infrastructure.DBContext;
using SystemTextJson = System.Text.Json;

namespace Sadef.Application.Services.Contact
{
    public class ContactService : IContactService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateContactDto> _createContactValidator;
        private readonly IValidator<UpdateContactDto> _updateContactValidator;
        private readonly IValidator<UpdateContactStatusDto> _updateContactStatusValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IStringLocalizer _localizer;
        private readonly IStringLocalizer _validationLocalizer;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEnumLocalizationService _enumLocalizationService;
        private readonly IDistributedCache _cache;
        private readonly SadefDbContext _context;
        private const string CONTACT_CACHE_PREFIX = "contact";
        private const int CACHE_DURATION_MINUTES = 10;

        public ContactService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateContactDto> createContactValidator,
            IValidator<UpdateContactDto> updateContactValidator,
            IValidator<UpdateContactStatusDto> updateContactStatusValidator,
            IQueryRepositoryFactory queryRepositoryFactory,
            IStringLocalizerFactory localizerFactory,
            IHttpContextAccessor httpContextAccessor,
            IEnumLocalizationService enumLocalizationService,
            IDistributedCache cache,
            SadefDbContext context)
        {
            _uow = uow;
            _mapper = mapper;
            _createContactValidator = createContactValidator;
            _updateContactValidator = updateContactValidator;
            _updateContactStatusValidator = updateContactStatusValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
            _validationLocalizer = localizerFactory.Create("Validation", "Sadef.Application");
            _httpContextAccessor = httpContextAccessor;
            _enumLocalizationService = enumLocalizationService;
            _cache = cache;
            _context = context;
        }

        public async Task<Response<ContactDto>> CreateContactAsync(CreateContactDto dto)
        {
            var validationResult = await _createContactValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return new Response<ContactDto>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            // Parse translations JSON if provided
            if (!string.IsNullOrEmpty(dto.TranslationsJson))
            {
                try
                {
                    var options = new SystemTextJson.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    dto.Translations = SystemTextJson.JsonSerializer.Deserialize<Dictionary<string, ContactTranslationDto>>(dto.TranslationsJson, options);
                }
                catch (Exception ex)
                {
                    return new Response<ContactDto>($"Invalid translations JSON format: {ex.Message}. Received: {dto.TranslationsJson}");
                }
            }

            // Validate that at least one translation is provided
            if (dto.Translations == null || !dto.Translations.Any())
            {
                return new Response<ContactDto>(_validationLocalizer["Contact_AtLeastOneTranslationRequired"]);
            }

            // Validate translation content
            var translationValidation = ValidateTranslations(dto.Translations);
            if (!translationValidation.IsValid)
            {
                return new Response<ContactDto>(translationValidation.ErrorMessage);
            }

            // Validate property reference if provided
            if (dto.PropertyId.HasValue)
            {
                var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
                var propertyExists = await queryRepo
                    .Queryable()
                    .AnyAsync(p => p.Id == dto.PropertyId.Value);
                if (!propertyExists)
                    return new Response<ContactDto>(_localizer["Contact_InvalidPropertyReference"]);
            }

            var contact = _mapper.Map<Sadef.Domain.ContactEntity.Contact>(dto);
            contact.Status = ContactStatus.New;
            contact.CreatedAt = DateTime.UtcNow;

            contact.ContentLanguage = DetermineContentLanguage(dto.Translations);

            if (dto.Translations != null && dto.Translations.Any())
            {
                var firstTranslation = dto.Translations.First().Value;
            }

            await _uow.RepositoryAsync<Sadef.Domain.ContactEntity.Contact>().AddAsync(contact);
            await _uow.SaveChangesAsync(CancellationToken.None);

            await SaveContactTranslationsInternalAsync(contact.Id, dto.Translations);

            await ClearContactCaches();

            var responseDto = _mapper.Map<ContactDto>(contact);
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(responseDto, contact.Id, currentLanguage);
            return new Response<ContactDto>(responseDto, _localizer["Contact_Created"]);
        }

        public async Task<Response<PaginatedResponse<ContactDto>>> GetPaginatedAsync(int pageNumber, int pageSize, ContactFilterDto filters, bool isExport)
        {
            var currentLanguage = GetCurrentLanguage();
            string cacheKey = $"{CONTACT_CACHE_PREFIX}:page={pageNumber}&size={pageSize}&lang={currentLanguage}&filters={JsonConvert.SerializeObject(filters)}";

            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var cachedResult = JsonConvert.DeserializeObject<PaginatedResponse<ContactDto>>(cached);
                if (cachedResult != null)
                    return new Response<PaginatedResponse<ContactDto>>(cachedResult, _localizer["Contact_ListedFromCache"]);
            }

            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var query = queryRepo.Queryable()
                .Include(c => c.Property)
                .Include(c => c.Translations)
                .AsQueryable();

            query = ApplyFilters(query, filters);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var contacts = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var result = new List<ContactDto>();

            foreach (var contact in contacts)
            {
                var dto = _mapper.Map<ContactDto>(contact);
                await ApplyLocalizationToDtoAsync(dto, contact.Id, currentLanguage);
                result.Add(dto);
            }

            var paginatedResponse = new PaginatedResponse<ContactDto>(result, totalCount, pageNumber, pageSize);

            // Cache for 10 minutes
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(CACHE_DURATION_MINUTES)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(paginatedResponse), cacheOptions);

            return new Response<PaginatedResponse<ContactDto>>(paginatedResponse, _localizer["Contact_Listed"]);
        }

        private IQueryable<Sadef.Domain.ContactEntity.Contact> ApplyFilters(IQueryable<Sadef.Domain.ContactEntity.Contact> query, ContactFilterDto filters)
        {
            if (!string.IsNullOrWhiteSpace(filters.FullName))
                query = query.Where(x => x.FullName.Contains(filters.FullName));

            if (!string.IsNullOrWhiteSpace(filters.Email))
                query = query.Where(x => x.Email.Contains(filters.Email));

            if (!string.IsNullOrWhiteSpace(filters.Phone))
                query = query.Where(x => x.Phone == filters.Phone);

            if (!string.IsNullOrWhiteSpace(filters.Subject))
            {
                var currentLanguage = GetCurrentLanguage();
                query = query.Where(c => c.Translations.Any(t =>
                    (t.LanguageCode == currentLanguage && t.Subject.Contains(filters.Subject)) ||
                    (currentLanguage != "en" && t.LanguageCode == "en" && t.Subject.Contains(filters.Subject))
                ));
            }

            if (filters.Type.HasValue)
                query = query.Where(x => x.Type == filters.Type.Value);

            if (filters.Status.HasValue)
                query = query.Where(x => x.Status == filters.Status.Value);

            if (filters.PropertyId.HasValue)
                query = query.Where(x => x.PropertyId == filters.PropertyId.Value);

            if (filters.IsUrgent.HasValue)
                query = query.Where(x => x.IsUrgent == filters.IsUrgent.Value);

            if (filters.CreatedAtFrom.HasValue)
                query = query.Where(x => x.CreatedAt >= filters.CreatedAtFrom.Value);

            if (filters.CreatedAtTo.HasValue)
                query = query.Where(x => x.CreatedAt <= filters.CreatedAtTo.Value);

            return query;
        }

        public async Task<Response<ContactDto>> GetByIdAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable()
                .Include(c => c.Property)
                .Include(c => c.Translations)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
                return new Response<ContactDto>{ Succeeded = false, Message = _localizer["Contact_NotFound"] };

            var contactDto = _mapper.Map<ContactDto>(contact);
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(contactDto, contact.Id, currentLanguage);
            return new Response<ContactDto>(contactDto, _localizer["Contact_Found"]);
        }

        public async Task<Response<ContactDto>> UpdateContactAsync(UpdateContactDto dto)
        {
            var validationResult = await _updateContactValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return new Response<ContactDto>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable()
                .Include(c => c.Translations)
                .FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (contact == null)
                return new Response<ContactDto>{ Succeeded = false, Message = _localizer["Contact_NotFound"] };

            // Update non-translatable fields
            if (!string.IsNullOrWhiteSpace(dto.FullName))
                contact.FullName = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                contact.Email = dto.Email;

            if (dto.Phone != null)
                contact.Phone = dto.Phone;

            if (dto.Type.HasValue)
                contact.Type = dto.Type.Value;

            if (dto.Status.HasValue)
                contact.Status = dto.Status.Value;

            if (dto.PropertyId.HasValue)
                contact.PropertyId = dto.PropertyId.Value;

            if (dto.PreferredContactTime.HasValue)
                contact.PreferredContactTime = dto.PreferredContactTime.Value;

            if (dto.Budget != null)
                contact.Budget = dto.Budget;

            if (dto.PropertyType != null)
                contact.PropertyType = dto.PropertyType;

            if (dto.IsUrgent.HasValue)
                contact.IsUrgent = dto.IsUrgent.Value;

            contact.UpdatedAt = DateTime.UtcNow;

            await _uow.SaveChangesAsync(CancellationToken.None);

            // Parse translations JSON if provided
            if (!string.IsNullOrEmpty(dto.TranslationsJson))
            {
                try
                {
                    var options = new SystemTextJson.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    dto.Translations = SystemTextJson.JsonSerializer.Deserialize<Dictionary<string, ContactTranslationDto>>(dto.TranslationsJson, options);
                }
                catch (Exception ex)
                {
                    return new Response<ContactDto>($"Invalid translations JSON format: {ex.Message}. Received: {dto.TranslationsJson}");
                }
            }

            // Update translations if provided
            if (dto.Translations != null)
            {
                var (isValid, errorMessage) = ValidateTranslations(dto.Translations);
                if (!isValid)
                {
                    return new Response<ContactDto>(errorMessage);
                }

                contact.ContentLanguage = DetermineContentLanguage(dto.Translations);
                await SaveContactTranslationsInternalAsync(contact.Id, dto.Translations);
            }

            // Clear all language-specific caches for contacts
            await ClearContactCaches();

            var contactDto = _mapper.Map<ContactDto>(contact);
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(contactDto, contact.Id, currentLanguage);
            return new Response<ContactDto>(contactDto, _localizer["Contact_Updated"]);
        }

        public async Task<Response<ContactDto>> ChangeStatusAsync(UpdateContactStatusDto dto)
        {
            var validationResult = await _updateContactStatusValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return new Response<ContactDto>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable().FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (contact == null)
                return new Response<ContactDto>{ Succeeded = false, Message = _localizer["Contact_NotFound"] };

            contact.Status = dto.Status;
            contact.UpdatedAt = DateTime.UtcNow;

            await _uow.SaveChangesAsync(CancellationToken.None);

            var contactDto = _mapper.Map<ContactDto>(contact);
            return new Response<ContactDto>(contactDto, _localizer["Contact_StatusUpdated"]);
        }

        public async Task<Response<ContactDashboardStatsDto>> GetContactDashboardStatsAsync()
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var query = queryRepo.Queryable();

            var stats = new ContactDashboardStatsDto
            {
                TotalContacts = await query.CountAsync(),
                NewContacts = await query.CountAsync(c => c.Status == ContactStatus.New),
                InProgressContacts = await query.CountAsync(c => c.Status == ContactStatus.InProgress),
                CompletedContacts = await query.CountAsync(c => c.Status == ContactStatus.Completed),
                UrgentContacts = await query.CountAsync(c => c.IsUrgent)
            };

            // Get contacts by type
            var contactsByType = await query
                .GroupBy(c => c.Type)
                .Select(g => new { Type = g.Key, Count = g.Count() })
                .ToListAsync();

            foreach (var item in contactsByType)
            {
                stats.ContactsByType[item.Type] = item.Count;
            }

            // Get contacts by status
            var contactsByStatus = await query
                .GroupBy(c => c.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            foreach (var item in contactsByStatus)
            {
                stats.ContactsByStatus[item.Status] = item.Count;
            }

            // Get recent contacts
            var recentContacts = await query
                .Include(c => c.Property)
                .Include(c => c.Translations)
                .OrderByDescending(c => c.CreatedAt)
                .Take(10)
                .ToListAsync();

            var currentLanguage = GetCurrentLanguage();
            var recentContactDtos = new List<ContactDto>();

            foreach (var contact in recentContacts)
            {
                var dto = _mapper.Map<ContactDto>(contact);
                await ApplyLocalizationToDtoAsync(dto, contact.Id, currentLanguage);
                recentContactDtos.Add(dto);
            }

            stats.RecentContacts = recentContactDtos;

            return new Response<ContactDashboardStatsDto>(stats);
        }

        public async Task<Response<List<ContactDto>>> GetContactsByPropertyAsync(int propertyId)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contacts = await queryRepo.Queryable()
                .Include(c => c.Property)
                .Include(c => c.Translations)
                .Where(c => c.PropertyId == propertyId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
            if (contacts.Count == 0)
                return new Response<List<ContactDto>> { Succeeded = false, Message = _localizer["Contact_NotFound"] };

            var currentLanguage = GetCurrentLanguage();
            var result = new List<ContactDto>();

            foreach (var contact in contacts)
            {
                var dto = _mapper.Map<ContactDto>(contact);
                await ApplyLocalizationToDtoAsync(dto, contact.Id, currentLanguage);
                result.Add(dto);
            }

            return new Response<List<ContactDto>>(result);
        }

        public async Task<Response<string>> DeleteContactAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable()
                .Include(c => c.Translations)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (contact == null)
                return new Response<string>{ Succeeded = false, Message = _localizer["Contact_NotFound"] };

            // Delete translations first
            if (contact.Translations.Any())
            {
                foreach (var translation in contact.Translations)
                {
                    _context.ContactTranslations.Remove(translation);
                }
            }

            await _uow.RepositoryAsync<Sadef.Domain.ContactEntity.Contact>().DeleteAsync(contact);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Clear all language-specific caches for contacts
            await ClearContactCaches();

            return new Response<string>(_localizer["Contact_Deleted"]);
        }

        private string GetCurrentLanguage()
        {
            try
            {
                var httpContext = _httpContextAccessor?.HttpContext;

                if (httpContext != null)
                {
                    // First try to get from middleware
                    var currentLanguage = httpContext.Items["CurrentLanguage"] as string;
                    if (!string.IsNullOrEmpty(currentLanguage))
                        return currentLanguage;

                    // Fallback to header parsing
                    var acceptLanguage = httpContext.Request.Headers["Accept-Language"].FirstOrDefault();

                    if (!string.IsNullOrEmpty(acceptLanguage))
                    {
                        var languages = acceptLanguage.Split(',')
                            .Select(lang => lang.Trim().Split(';')[0].ToLower())
                            .ToList();

                        if (languages.Any(lang => lang.StartsWith("ar")))
                            return "ar";

                        if (languages.Any(lang => lang.StartsWith("en")))
                            return "en";
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                // For now, just continue with default
            }

            return "en"; // Default to English
        }

        private ContentLanguage DetermineContentLanguage(Dictionary<string, ContactTranslationDto> translations)
        {
            if (translations.ContainsKey("en") && translations.ContainsKey("ar"))
                return ContentLanguage.Both;
            else if (translations.ContainsKey("ar"))
                return ContentLanguage.Arabic;
            else
                return ContentLanguage.English;
        }

        private async Task ApplyLocalizationToDtoAsync(ContactDto dto, int contactId, string languageCode)
        {
            if (_context == null) return;

            // Get all translations for this contact in a single query
            var allTranslations = await _context.ContactTranslations
                .Where(t => t.ContactId == contactId)
                .ToListAsync();

            // Get translation for the requested language
            var translation = allTranslations.FirstOrDefault(t => t.LanguageCode == languageCode);

            if (translation != null)
            {
                // Apply translation to DTO
                ApplyTranslationToDto(dto, translation);
            }
            else if (languageCode != "en")
            {
                // Fallback to English if requested language not found
                var englishTranslation = allTranslations.FirstOrDefault(t => t.LanguageCode == "en");
                if (englishTranslation != null)
                {
                    ApplyTranslationToDto(dto, englishTranslation);
                }
            }
            else
            {
                // If no translation found for the requested language and it's not English,
                // try to get any available translation
                var anyTranslation = allTranslations.FirstOrDefault();
                if (anyTranslation != null)
                {
                    ApplyTranslationToDto(dto, anyTranslation);
                }
            }
        }

        private void ApplyTranslationToDto(ContactDto dto, ContactTranslation translation)
        {
            dto.Subject = translation.Subject;
            dto.Message = translation.Message;
            dto.PreferredContactMethod = translation.PreferredContactMethod;
            dto.Location = translation.Location;
        }

        private async Task SaveContactTranslationsInternalAsync(int contactId, Dictionary<string, ContactTranslationDto> translations)
        {
            if (_context == null) return;

            // Get existing translations
            var existingTranslations = await _context.ContactTranslations
                .Where(t => t.ContactId == contactId)
                .ToListAsync();

            // Update or create translations
            foreach (var translation in translations)
            {
                var languageCode = translation.Key;
                var translationDto = translation.Value;

                var existingTranslation = await _context.ContactTranslations
                    .FirstOrDefaultAsync(t => t.ContactId == contactId && t.LanguageCode == languageCode);

                if (existingTranslation != null)
                {
                    // Update existing translation
                    existingTranslation.Subject = translationDto.Subject;
                    existingTranslation.Message = translationDto.Message;
                    existingTranslation.PreferredContactMethod = translationDto.PreferredContactMethod;
                    existingTranslation.Location = translationDto.Location;

                    _context.ContactTranslations.Update(existingTranslation);
                }
                else
                {
                    // Create new translation
                    var newTranslation = new ContactTranslation
                    {
                        ContactId = contactId,
                        LanguageCode = languageCode,
                        Subject = translationDto.Subject,
                        Message = translationDto.Message,
                        PreferredContactMethod = translationDto.PreferredContactMethod,
                        Location = translationDto.Location
                    };

                    _context.ContactTranslations.Add(newTranslation);
                }
            }

            await _context.SaveChangesAsync();
        }

        private (bool IsValid, string ErrorMessage) ValidateTranslations(Dictionary<string, ContactTranslationDto> translations)
        {
            if (translations == null || !translations.Any())
            {
                return (false, _validationLocalizer["Contact_AtLeastOneTranslationRequired"]);
            }

            foreach (var translation in translations)
            {
                var languageCode = translation.Key;
                var translationDto = translation.Value;

                if (string.IsNullOrWhiteSpace(translationDto.Subject))
                {
                    return (false, _validationLocalizer["Contact_SubjectRequiredForLanguage", languageCode]);
                }

                if (string.IsNullOrWhiteSpace(translationDto.Message))
                {
                    return (false, _validationLocalizer["Contact_MessageRequiredForLanguage", languageCode]);
                }

                // Validate language code
                if (languageCode != "en" && languageCode != "ar")
                {
                    return (false, _validationLocalizer["Contact_InvalidLanguageCode", languageCode]);
                }
            }

            return (true, string.Empty);
        }

        private async Task ClearContactCaches()
        {
            // Clear all language-specific cache keys for contacts
            var cacheKeys = new List<string>
            {
                $"{CONTACT_CACHE_PREFIX}:page=1&size=10&lang=en",
                $"{CONTACT_CACHE_PREFIX}:page=1&size=10&lang=ar"
            };

            foreach (var key in cacheKeys)
            {
                await _cache.RemoveAsync(key);
            }
        }
    }
} 