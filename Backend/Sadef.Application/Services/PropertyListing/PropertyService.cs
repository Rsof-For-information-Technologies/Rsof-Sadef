using AutoMapper;
using Azure.Core;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;
using Sadef.Domain.PropertyEntity;
using Sadef.Infrastructure.DBContext;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sadef.Application.Services.Multilingual;
using SystemTextJson = System.Text.Json;

namespace Sadef.Application.Services.PropertyListing
{
    public class PropertyService : IPropertyService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IValidator<CreatePropertyDto> _createPropertyValidator;
        private readonly IValidator<UpdatePropertyDto> _updatePropertyValidator;
        private readonly IValidator<PropertyExpiryUpdateDto> _expireValidator;
        private readonly IDistributedCache _cache;
        private readonly IStringLocalizer _localizer;
        private readonly SadefDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEnumLocalizationService _enumLocalizationService;

        public PropertyService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IValidator<UpdatePropertyDto> updatePropertyValidator, IValidator<CreatePropertyDto> createPropertyDto , IDistributedCache cache, IValidator<PropertyExpiryUpdateDto> expireValidator, IStringLocalizerFactory localizerFactory, SadefDbContext context, IHttpContextAccessor httpContextAccessor, IEnumLocalizationService enumLocalizationService)
        {
            _uow = uow;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updatePropertyValidator = updatePropertyValidator;
            _createPropertyValidator = createPropertyDto;
            _cache = cache;
            _expireValidator = expireValidator;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _enumLocalizationService = enumLocalizationService;
        }

        public async Task<Response<PropertyDto>> CreatePropertyAsync(CreatePropertyDto dto)
        {
            var validationResult = await _createPropertyValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<PropertyDto>(errorMessage);
            }

            // Handle translations from form-data JSON string
            if (!string.IsNullOrEmpty(dto.TranslationsJson))
            {
                try
                {
                    var options = new SystemTextJson.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    dto.Translations = SystemTextJson.JsonSerializer.Deserialize<Dictionary<string, PropertyTranslationDto>>(dto.TranslationsJson, options);
                }
                catch (Exception ex)
                {
                    return new Response<PropertyDto>($"Invalid translations JSON format: {ex.Message}. Received: {dto.TranslationsJson}");
                }
            }
            // Validate that translations are provided
            if (dto.Translations == null || !dto.Translations.Any())
            {
                return new Response<PropertyDto>("At least one translation is required");
            }

            var property = _mapper.Map<Property>(dto);
            property.Images = new List<PropertyImage>();

            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var image = new PropertyImage
                    {
                        ImageData = ms.ToArray(),
                        ContentType = file.ContentType
                    };
                    property.Images.Add(image);
                }
            }
            property.Videos = new List<PropertyVideo>();
            if (dto.Videos != null)
            {
                foreach (var file in dto.Videos)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var video = new PropertyVideo
                    {
                        VideoData = ms.ToArray(),
                        ContentType = file.ContentType
                    };
                    property.Videos.Add(video);
                }
            }

            // Set ContentLanguage based on available translations
            property.ContentLanguage = DetermineContentLanguage(dto.Translations);

            // Save property using the same context as translations
            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            // Handle multilingual translations
            await SavePropertyTranslationsInternalAsync(property.Id, dto.Translations);

            // Clear all language-specific caches for properties
            await _cache.RemoveAsync("property:page=1&size=10&lang=en");
            await _cache.RemoveAsync("property:page=1&size=10&lang=ar");
            
            var createdDto = _mapper.Map<PropertyDto>(property);
            createdDto.ImageBase64Strings = property.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();
            createdDto.VideoUrls = property.Videos?
                .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                .ToList() ?? new();
            
            // Apply localization to the created DTO
            var currentLanguage = GetCurrentLanguage();
            // For now, let's force English to test
            await ApplyLocalizationToDtoAsync(createdDto, property.Id, "en");
            
            return new Response<PropertyDto>(createdDto, _localizer["Property_Created"]);
        }


        public async Task<Response<PaginatedResponse<PropertyDto>>> GetAllPropertiesAsync(PaginationRequest request)
        {
            var currentLanguage = GetCurrentLanguage();
            string cacheKey = $"property:page={request.PageNumber}&size={request.PageSize}&lang={currentLanguage}";
            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var cachedResult = JsonConvert.DeserializeObject<PaginatedResponse<PropertyDto>>(cached);
                return new Response<PaginatedResponse<PropertyDto>>(cachedResult, _localizer["Property_ListedFromCache"]);
            }
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var query = queryRepo.Queryable().Include(p => p.Images).Include(p => p.Videos);

            var totalCount = await query.CountAsync();
            var items = await query.Where(p => !p.ExpiryDate.HasValue || p.ExpiryDate > DateTime.UtcNow)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var result = items.Select(async p =>
            {
                var dto = _mapper.Map<PropertyDto>(p);
                dto.ImageBase64Strings = p.Images?.Select(img =>
                    $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();
                dto.VideoUrls = p.Videos?.Select(v =>
                    $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}").ToList() ?? new();
                
                // Apply localization to DTO
                await ApplyLocalizationToDtoAsync(dto, p.Id, currentLanguage);
                
                                 // Set localized enum values as strings
                 dto.PropertyType = _enumLocalizationService.GetLocalizedEnumValue(p.PropertyType, currentLanguage);
                 dto.UnitCategory = p.UnitCategory.HasValue ? _enumLocalizationService.GetLocalizedEnumValue(p.UnitCategory.Value, currentLanguage) : null;
                 dto.Status = _enumLocalizationService.GetLocalizedEnumValue(p.Status, currentLanguage);
                
                return dto;
            }).ToList();

            // Wait for all async operations to complete
            var resultList = new List<PropertyDto>();
            foreach (var task in result)
            {
                resultList.Add(await task);
            }

            var paged = new PaginatedResponse<PropertyDto>(resultList, totalCount, request.PageNumber, request.PageSize);

            // cache for 10 minutes
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(paged), cacheOptions);

            return new Response<PaginatedResponse<PropertyDto>>(paged, _localizer["Property_Listed"]);
        }

        public async Task<Response<PropertyDto>> GetPropertyByIdAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var property = await queryRepo
                .Queryable()
                .Include(p => p.Images!)
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return new Response<PropertyDto>(_localizer["Property_NotFound"]);

            var dto = _mapper.Map<PropertyDto>(property);
            dto.ImageBase64Strings = property.Images?.Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();
            dto.VideoUrls = property.Videos?
                .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                .ToList() ?? new();

            // Apply localization based on user's language preference
            var currentLanguage = GetCurrentLanguage();
            await ApplyLocalizationToDtoAsync(dto, property.Id, currentLanguage);

                         // Set localized enum values as strings
             dto.PropertyType = _enumLocalizationService.GetLocalizedEnumValue(property.PropertyType, currentLanguage);
             dto.UnitCategory = property.UnitCategory.HasValue ? _enumLocalizationService.GetLocalizedEnumValue(property.UnitCategory.Value, currentLanguage) : null;
             dto.Status = _enumLocalizationService.GetLocalizedEnumValue(property.Status, currentLanguage);

            return new Response<PropertyDto>(dto, _localizer["Property_Found"]);
        }

        public async Task<Response<string>> DeletePropertyAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var property = await queryRepo
                .Queryable()
                .Include(p => p.Images!)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return new Response<string>(_localizer["Property_NotFound"]);
            property.IsActive = false; // Soft delete


            await _uow.RepositoryAsync<Property>().UpdateAsync(property);
            await _uow.SaveChangesAsync(CancellationToken.None);
            // Clear all language-specific caches for properties
            await _cache.RemoveAsync("property:page=1&size=10&lang=en");
            await _cache.RemoveAsync("property:page=1&size=10&lang=ar");
            return new Response<string>(_localizer["Property_Deleted"]);
        }

        public async Task<Response<PropertyDto>> UpdatePropertyAsync(UpdatePropertyDto dto)
        {
            var validationResult = await _updatePropertyValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<PropertyDto>(errorMessage);
            }

            // Handle translations from form-data JSON string
            if (!string.IsNullOrEmpty(dto.TranslationsJson))
            {
                try
                {
                    var options = new SystemTextJson.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    dto.Translations = SystemTextJson.JsonSerializer.Deserialize<Dictionary<string, PropertyTranslationDto>>(dto.TranslationsJson, options);
                }
                catch (Exception ex)
                {
                    return new Response<PropertyDto>($"Invalid translations JSON format: {ex.Message}. Received: {dto.TranslationsJson}");
                }
            }
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var existing = await queryRepo
                .Queryable()
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (existing == null)
                return new Response<PropertyDto>(_localizer["Property_NotFound"]);

            _mapper.Map(dto, existing);

            if (dto.Images != null && dto.Images.Any())
            {
                existing.Images = new List<PropertyImage>();
                foreach (var file in dto.Images)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var image = new PropertyImage
                    {
                        ImageData = ms.ToArray(),
                        ContentType = file.ContentType
                    };
                    existing.Images.Add(image);
                }
            }
            existing.Videos = new List<PropertyVideo>();
            if (dto.Videos != null)
            {
                foreach (var file in dto.Videos)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var video = new PropertyVideo
                    {
                        VideoData = ms.ToArray(),
                        ContentType = file.ContentType
                    };
                    existing.Videos.Add(video);
                }
            }

            await _uow.RepositoryAsync<Property>().UpdateAsync(existing);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Handle multilingual translations if provided
            if (dto.Translations != null && dto.Translations.Any())
            {
                await SavePropertyTranslationsInternalAsync(existing.Id, dto.Translations);
            }

            // Clear all language-specific caches for properties
            await _cache.RemoveAsync("property:page=1&size=10&lang=en");
            await _cache.RemoveAsync("property:page=1&size=10&lang=ar");
            var updatedDto = _mapper.Map<PropertyDto>(existing);
            updatedDto.ImageBase64Strings = existing.Images?.Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();
            updatedDto.VideoUrls = existing.Videos?
                .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                .ToList() ?? new();

            return new Response<PropertyDto>(updatedDto, _localizer["Property_Updated"]);
        }

        public async Task<Response<PropertyDto>> ChangeStatusAsync(PropertyStatusUpdateDto dto)
        {
            var repo = _uow.RepositoryAsync<Property>();
            var property = await _queryRepositoryFactory.QueryRepository<Property>()
                .Queryable()
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (property == null)
                return new Response<PropertyDto>(_localizer["Property_NotFound"]);

            var currentStatus = property.Status;

            var allowedTransitions = new Dictionary<PropertyStatus, PropertyStatus[]>
            {
                { PropertyStatus.Pending,   new[] { PropertyStatus.Approved, PropertyStatus.Rejected, PropertyStatus.Archived } },
                { PropertyStatus.Approved,  new[] { PropertyStatus.Sold, PropertyStatus.Rejected, PropertyStatus.Archived } },
                { PropertyStatus.Sold,      new[] { PropertyStatus.Archived } },
                { PropertyStatus.Rejected,  new[] { PropertyStatus.Archived } },
                { PropertyStatus.Archived,  Array.Empty<PropertyStatus>() }
            };

            if (!allowedTransitions.TryGetValue(currentStatus, out var validNextStatuses) ||
                !validNextStatuses.Contains(dto.status))
            {
                return new Response<PropertyDto>(string.Format(_localizer["Property_InvalidStatusTransition"], currentStatus, dto.status));
            }

            property.Status = dto.status;
            await repo.UpdateAsync(property);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<PropertyDto>(property);
            // Clear all language-specific caches for properties
            await _cache.RemoveAsync("property:page=1&size=10&lang=en");
            await _cache.RemoveAsync("property:page=1&size=10&lang=ar");
            return new Response<PropertyDto>(updatedDto, string.Format(_localizer["Property_StatusUpdated"], currentStatus, property.Status));
        }

        public async Task<Response<PaginatedResponse<PropertyDto>>> GetFilteredPropertiesAsync(PropertyFilterRequest request)
        {
            string cacheKey = $"property:page={request.PageNumber}&size={request.PageSize}&city={request.City}&type={request.PropertyType}&status={request.Status}&min={request.MinPrice}&max={request.MaxPrice}";

            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var fromCache = JsonConvert.DeserializeObject<PaginatedResponse<PropertyDto>>(cached);
                return new Response<PaginatedResponse<PropertyDto>>(fromCache, _localizer["Property_FilteredFromCache"]);
            }

            var query = _queryRepositoryFactory.QueryRepository<Property>()
                .Queryable()
                .Include(p => p.Images)
                .AsQueryable()
                .ApplyFilters(request);

            int total = await query.CountAsync();

            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var result = items.Select(p =>
            {
                var dto = _mapper.Map<PropertyDto>(p);
                dto.ImageBase64Strings = p.Images?.Select(img =>
                    $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();
               return dto;
            }).ToList();

            var paged = new PaginatedResponse<PropertyDto>(result, total, request.PageNumber, request.PageSize);

            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(paged), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            });

            return new Response<PaginatedResponse<PropertyDto>>(paged, _localizer["Property_Filtered"]);
        }
        public async Task<Response<PropertyDto>> UpdateExpiryAsync(PropertyExpiryUpdateDto dto)
        {
            var validationResult = await _expireValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<PropertyDto>(errorMessage);
            }
            var repo = _uow.RepositoryAsync<Property>();
            var property = await _queryRepositoryFactory.QueryRepository<Property>()
                .Queryable()
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (property == null)
                return new Response<PropertyDto>(_localizer["Property_NotFound"]);

            property.ExpiryDate = dto.ExpiryDate;
            await repo.UpdateAsync(property);
            await _uow.SaveChangesAsync(CancellationToken.None);
            // Clear all language-specific caches for properties
            await _cache.RemoveAsync("property:page=1&size=10&lang=en");
            await _cache.RemoveAsync("property:page=1&size=10&lang=ar");
            var result = _mapper.Map<PropertyDto>(property);
            return new Response<PropertyDto>(result, string.Format(_localizer["Property_ExpirySet"], dto.ExpiryDate.ToString("yyyy-MM-dd")));
        }
        public async Task<Response<PropertyDashboardStatsDto>> GetPropertyDashboardStatsAsync()
        {
            string cacheKey = "property:dashboard:stats";
            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var dtoData = JsonConvert.DeserializeObject<PropertyDashboardStatsDto>(cached);
                return new Response<PropertyDashboardStatsDto>(dtoData, _localizer["Property_DashboardLoadedFromCache"]);
            }
            var query = _queryRepositoryFactory.QueryRepository<Property>().Queryable();

            var now = DateTime.UtcNow;
            var oneWeekAgo = now.AddDays(-7);

            var total = await query.CountAsync();
            var active = await query.CountAsync(p => !p.ExpiryDate.HasValue || p.ExpiryDate > now);
            var expired = await query.CountAsync(p => p.ExpiryDate.HasValue && p.ExpiryDate <= now);

            var pending = await query.CountAsync(p => p.Status == PropertyStatus.Pending);
            var approved = await query.CountAsync(p => p.Status == PropertyStatus.Approved);
            var sold = await query.CountAsync(p => p.Status == PropertyStatus.Sold);
            var rejected = await query.CountAsync(p => p.Status == PropertyStatus.Rejected);
            var archived = await query.CountAsync(p => p.Status == PropertyStatus.Archived);

            var listedThisWeek = await query.CountAsync(p => p.CreatedAt >= oneWeekAgo);

            var propertiesWithInvestmentData = await query
                .CountAsync(p => p.ProjectedResaleValue.HasValue || p.ExpectedAnnualRent.HasValue);

            var totalRent = await query
                .Where(p => p.ExpectedAnnualRent.HasValue)
                .SumAsync(p => p.ExpectedAnnualRent.Value);

            var totalResale = await query
                .Where(p => p.ProjectedResaleValue.HasValue)
                .SumAsync(p => p.ProjectedResaleValue.Value);

            var unitCategoryCounts = await query
                .GroupBy(p => p.UnitCategory)
                .Select(g => new { Category = g.Key.ToString(), Count = g.Count() })
                .ToDictionaryAsync(g => g.Category ?? "Unknown", g => g.Count);
            var activeProperties = await query
                .Where(p => p.IsActive.HasValue && p.IsActive.Value)
                .CountAsync();

            var dto = new PropertyDashboardStatsDto
            {
                TotalProperties = total,
                ActiveProperties = active,
                ExpiredProperties = expired,
                PendingCount = pending,
                ApprovedCount = approved,
                SoldCount = sold,
                RejectedCount = rejected,
                ArchivedCount = archived,
                ListedThisWeek = listedThisWeek,
                PropertiesWithInvestmentData = propertiesWithInvestmentData,
                TotalExpectedAnnualRent = totalRent,
                TotalProjectedResaleValue = totalResale,
                UnitCategoryCounts = unitCategoryCounts,
                activeProperties = activeProperties
            };

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(dto), options);

            return new Response<PropertyDashboardStatsDto>(dto, _localizer["Property_DashboardLoaded"]);
        }

        private async Task SavePropertyTranslationsInternalAsync(int propertyId, Dictionary<string, PropertyTranslationDto> translations)
        {
            if (_context == null) return;
        
            foreach (var translation in translations)
            {
                var languageCode = translation.Key;
                var translationDto = translation.Value;
        
                // Debug: Check if translationDto has content
                if (string.IsNullOrEmpty(translationDto.Title))
                {
                    throw new Exception($"Translation for language '{languageCode}' has empty Title. PropertyId: {propertyId}");
                }
        
                var existingTranslation = await _context.PropertyTranslations
                    .FirstOrDefaultAsync(t => t.PropertyId == propertyId && t.LanguageCode == languageCode);
        
                if (existingTranslation != null)
                {
                    // Update existing translation
                    existingTranslation.Title = translationDto.Title;
                    existingTranslation.Description = translationDto.Description;
                    existingTranslation.UnitName = translationDto.UnitName;
                    existingTranslation.WarrantyInfo = translationDto.WarrantyInfo;
                    existingTranslation.MetaTitle = translationDto.MetaTitle;
                    existingTranslation.MetaDescription = translationDto.MetaDescription;
                    existingTranslation.MetaKeywords = translationDto.MetaKeywords;
                    existingTranslation.Slug = translationDto.Slug;
                    existingTranslation.CanonicalUrl = translationDto.CanonicalUrl;
                }
                else
                {
                    // Create new translation
                    var newTranslation = new PropertyTranslation
                    {
                        PropertyId = propertyId,
                        LanguageCode = languageCode,
                        Title = translationDto.Title,
                        Description = translationDto.Description,
                        UnitName = translationDto.UnitName,
                        WarrantyInfo = translationDto.WarrantyInfo,
                        MetaTitle = translationDto.MetaTitle,
                        MetaDescription = translationDto.MetaDescription,
                        MetaKeywords = translationDto.MetaKeywords,
                        Slug = translationDto.Slug,
                        CanonicalUrl = translationDto.CanonicalUrl
                    };
                    _context.PropertyTranslations.Add(newTranslation);
                }
            }
        
            await _context.SaveChangesAsync();
        }
        
        // Removed ApplyLocalizationAsync method as it's no longer needed
        // We now use ApplyLocalizationToDtoAsync instead

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

        // New helper methods for the restructured approach
        private ContentLanguage DetermineContentLanguage(Dictionary<string, PropertyTranslationDto> translations)
        {
            if (translations.ContainsKey("en") && translations.ContainsKey("ar"))
                return ContentLanguage.Both;
            else if (translations.ContainsKey("ar"))
                return ContentLanguage.Arabic;
            else
                return ContentLanguage.English;
        }

        private async Task ApplyLocalizationToDtoAsync(PropertyDto dto, int propertyId, string languageCode = "en")
        {
            if (_context == null) return;

            // Debug: Check if translations exist for this property
            var allTranslations = await _context.PropertyTranslations
                .Where(t => t.PropertyId == propertyId)
                .ToListAsync();

            // Get translation for the requested language
            var translation = allTranslations.FirstOrDefault(t => t.LanguageCode == languageCode);

            if (translation != null)
            {
                // Apply translation to DTO
                dto.Title = translation.Title;
                dto.Description = translation.Description;
                dto.UnitName = translation.UnitName;
                dto.WarrantyInfo = translation.WarrantyInfo;
                dto.MetaTitle = translation.MetaTitle;
                dto.MetaDescription = translation.MetaDescription;
                dto.MetaKeywords = translation.MetaKeywords;
                dto.Slug = translation.Slug;
                dto.CanonicalUrl = translation.CanonicalUrl;
            }
            else if (languageCode != "en")
            {
                // Fallback to English if requested language not found
                var englishTranslation = allTranslations.FirstOrDefault(t => t.LanguageCode == "en");

                if (englishTranslation != null)
                {
                    dto.Title = englishTranslation.Title;
                    dto.Description = englishTranslation.Description;
                    dto.UnitName = englishTranslation.UnitName;
                    dto.WarrantyInfo = englishTranslation.WarrantyInfo;
                    dto.MetaTitle = englishTranslation.MetaTitle;
                    dto.MetaDescription = englishTranslation.MetaDescription;
                    dto.MetaKeywords = englishTranslation.MetaKeywords;
                    dto.Slug = englishTranslation.Slug;
                    dto.CanonicalUrl = englishTranslation.CanonicalUrl;
                }
            }
            else
            {
                // If no translation found for the requested language and it's not English,
                // try to get any available translation
                var anyTranslation = allTranslations.FirstOrDefault();

                if (anyTranslation != null)
                {
                    dto.Title = anyTranslation.Title;
                    dto.Description = anyTranslation.Description;
                    dto.UnitName = anyTranslation.UnitName;
                    dto.WarrantyInfo = anyTranslation.WarrantyInfo;
                    dto.MetaTitle = anyTranslation.MetaTitle;
                    dto.MetaDescription = anyTranslation.MetaDescription;
                    dto.MetaKeywords = anyTranslation.MetaKeywords;
                    dto.Slug = anyTranslation.Slug;
                    dto.CanonicalUrl = anyTranslation.CanonicalUrl;
                }
            }
        }

        // Multilingual method implementations
        public async Task<Response<PropertyDto>> GetMultilingualPropertyByIdAsync(int id, string languageCode)
        {
            // This method will be implemented later when we integrate the multilingual service
            throw new NotImplementedException("Multilingual functionality not yet implemented in PropertyService");
        }

        public async Task<Response<PaginatedResponse<PropertyDto>>> GetLocalizedPropertiesAsync(PaginationRequest request, string languageCode)
        {
            // This method will be implemented later when we integrate the multilingual service
            throw new NotImplementedException("Multilingual functionality not yet implemented in PropertyService");
        }

        public async Task<Response<bool>> SavePropertyTranslationsAsync(int propertyId, Dictionary<string, PropertyTranslationDto> translations)
        {
            try
            {
                await SavePropertyTranslationsInternalAsync(propertyId, translations);
                return new Response<bool>(true, "Translations saved successfully");
            }
            catch (Exception ex)
            {
                return new Response<bool>($"Error saving translations: {ex.Message}");
            }
        }
    }
}
