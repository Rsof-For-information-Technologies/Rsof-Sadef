using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Localization;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.ContactDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Services.Contact;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;
using Sadef.Domain.ContactEntity;
using Sadef.Domain.PropertyEntity;
using Sadef.Domain.Users;

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
        private readonly IDistributedCache _cache;
        private readonly IStringLocalizer _localizer;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContactService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateContactDto> createContactValidator,
            IValidator<UpdateContactDto> updateContactValidator,
            IValidator<UpdateContactStatusDto> updateContactStatusValidator,
            IQueryRepositoryFactory queryRepositoryFactory,
            IDistributedCache cache,
            IStringLocalizerFactory localizerFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _uow = uow;
            _mapper = mapper;
            _createContactValidator = createContactValidator;
            _updateContactValidator = updateContactValidator;
            _updateContactStatusValidator = updateContactStatusValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _cache = cache;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Response<ContactDto>> CreateContactAsync(CreateContactDto dto)
        {
            var validationResult = await _createContactValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<ContactDto>(errorMessage);
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

            await _uow.RepositoryAsync<Sadef.Domain.ContactEntity.Contact>().AddAsync(contact);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Invalidate cache
            await _cache.RemoveAsync("contact:dashboard:stats");

            var responseDto = _mapper.Map<ContactDto>(contact);
            return new Response<ContactDto>(responseDto, _localizer["Contact_Created"]);
        }

        public async Task<Response<PaginatedResponse<ContactDto>>> GetPaginatedAsync(int pageNumber, int pageSize, ContactFilterDto filters, bool isExport)
        {
            if (isExport)
            {
                return await GetFreshPaginatedContactsAsync(pageNumber, pageSize, filters, true);
            }

            var cacheKey = $"contacts:page:{pageNumber}:size:{pageSize}:filters:{System.Text.Json.JsonSerializer.Serialize(filters)}";
            var cached = await _cache.GetStringAsync(cacheKey);
            if (cached != null)
            {
                var result = System.Text.Json.JsonSerializer.Deserialize<PaginatedResponse<ContactDto>>(cached);
                return new Response<PaginatedResponse<ContactDto>>(result);
            }

            var freshResult = await GetFreshPaginatedContactsAsync(pageNumber, pageSize, filters, false);
            if (freshResult.Succeeded)
            {
                await _cache.SetStringAsync(cacheKey, System.Text.Json.JsonSerializer.Serialize(freshResult.Data), new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
                });
            }

            return freshResult;
        }

        private async Task<Response<PaginatedResponse<ContactDto>>> GetFreshPaginatedContactsAsync(int pageNumber, int pageSize, ContactFilterDto filters, bool isExport)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var query = queryRepo.Queryable()
                .Include(c => c.Property)
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

            var contactDtos = _mapper.Map<List<ContactDto>>(contacts);

            var paginatedResponse = new PaginatedResponse<ContactDto>(contactDtos, totalCount, pageNumber, pageSize);

            return new Response<PaginatedResponse<ContactDto>>(paginatedResponse);
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
                query = query.Where(x => x.Subject.Contains(filters.Subject));

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
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contact == null)
                return new Response<ContactDto>(_localizer["Contact_NotFound"]);

            var contactDto = _mapper.Map<ContactDto>(contact);
            return new Response<ContactDto>(contactDto);
        }

        public async Task<Response<ContactDto>> UpdateContactAsync(UpdateContactDto dto)
        {
            var validationResult = await _updateContactValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<ContactDto>(errorMessage);
            }

            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable().FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (contact == null)
                return new Response<ContactDto>(_localizer["Contact_NotFound"]);

            // Update only provided fields
            if (!string.IsNullOrWhiteSpace(dto.FullName))
                contact.FullName = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                contact.Email = dto.Email;

            if (dto.Phone != null)
                contact.Phone = dto.Phone;

            if (!string.IsNullOrWhiteSpace(dto.Subject))
                contact.Subject = dto.Subject;

            if (!string.IsNullOrWhiteSpace(dto.Message))
                contact.Message = dto.Message;

            if (dto.Type.HasValue)
                contact.Type = dto.Type.Value;

            if (dto.Status.HasValue)
                contact.Status = dto.Status.Value;

            if (dto.PropertyId.HasValue)
                contact.PropertyId = dto.PropertyId.Value;



            if (dto.PreferredContactMethod != null)
                contact.PreferredContactMethod = dto.PreferredContactMethod;

            if (dto.PreferredContactTime.HasValue)
                contact.PreferredContactTime = dto.PreferredContactTime.Value;

            if (dto.Budget != null)
                contact.Budget = dto.Budget;

            if (dto.PropertyType != null)
                contact.PropertyType = dto.PropertyType;

            if (dto.Location != null)
                contact.Location = dto.Location;

            if (dto.IsUrgent.HasValue)
                contact.IsUrgent = dto.IsUrgent.Value;

            contact.UpdatedAt = DateTime.UtcNow;

            await _uow.SaveChangesAsync(CancellationToken.None);

            // Invalidate cache
            await _cache.RemoveAsync("contact:dashboard:stats");

            var contactDto = _mapper.Map<ContactDto>(contact);
            return new Response<ContactDto>(contactDto, _localizer["Contact_Updated"]);
        }

        public async Task<Response<ContactDto>> ChangeStatusAsync(UpdateContactStatusDto dto)
        {
            var validationResult = await _updateContactStatusValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<ContactDto>(errorMessage);
            }

            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable().FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (contact == null)
                return new Response<ContactDto>(_localizer["Contact_NotFound"]);

            contact.Status = dto.Status;
            contact.UpdatedAt = DateTime.UtcNow;

            await _uow.SaveChangesAsync(CancellationToken.None);

            // Invalidate cache
            await _cache.RemoveAsync("contact:dashboard:stats");

            var contactDto = _mapper.Map<ContactDto>(contact);
            return new Response<ContactDto>(contactDto, _localizer["Contact_StatusUpdated"]);
        }

        public async Task<Response<ContactDashboardStatsDto>> GetContactDashboardStatsAsync()
        {
            var cacheKey = "contact:dashboard:stats";
            var cached = await _cache.GetStringAsync(cacheKey);
            if (cached != null)
            {
                var result = System.Text.Json.JsonSerializer.Deserialize<ContactDashboardStatsDto>(cached);
                return new Response<ContactDashboardStatsDto>(result);
            }

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
                .OrderByDescending(c => c.CreatedAt)
                .Take(10)
                .ToListAsync();

            stats.RecentContacts = _mapper.Map<List<ContactDto>>(recentContacts);

            await _cache.SetStringAsync(cacheKey, System.Text.Json.JsonSerializer.Serialize(stats), new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            });

            return new Response<ContactDashboardStatsDto>(stats);
        }



        public async Task<Response<List<ContactDto>>> GetContactsByPropertyAsync(int propertyId)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contacts = await queryRepo.Queryable()
                .Include(c => c.Property)
                .Where(c => c.PropertyId == propertyId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            var contactDtos = _mapper.Map<List<ContactDto>>(contacts);
            return new Response<List<ContactDto>>(contactDtos);
        }

        public async Task<Response<string>> DeleteContactAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Sadef.Domain.ContactEntity.Contact>();
            var contact = await queryRepo.Queryable().FirstOrDefaultAsync(c => c.Id == id);
            if (contact == null)
                return new Response<string>(_localizer["Contact_NotFound"]);

            await _uow.RepositoryAsync<Sadef.Domain.ContactEntity.Contact>().DeleteAsync(contact);
            await _uow.SaveChangesAsync(CancellationToken.None);

            // Invalidate cache
            await _cache.RemoveAsync("contact:dashboard:stats");

            return new Response<string>(_localizer["Contact_Deleted"]);
        }
    }
} 