using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;
using Sadef.Domain.PropertyEntity;

namespace Sadef.Application.Services.Lead
{
    public class LeadService : ILeadService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateLeadDto> _createLeadValidator;
        private readonly IValidator<UpdateLeadDto> _updateLeadValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly INotificationService _notificationService;
        private readonly IUserManagementService _userService;
        private readonly IDistributedCache _cache;

        public LeadService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateLeadDto> createLeadValidator,
            IQueryRepositoryFactory queryRepositoryFactory,
            IValidator<UpdateLeadDto> updateLeadValidator,
            IDistributedCache cache,
            INotificationService notificationService,
            IUserManagementService userService)
        {
            _uow = uow;
            _mapper = mapper;
            _createLeadValidator = createLeadValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updateLeadValidator = updateLeadValidator;
            _cache = cache;
            _notificationService = notificationService;
            _userService = userService;
        }

        public async Task<Response<LeadDto>> CreateLeadAsync(CreateLeadDto dto)
        {
            var validationResult = await _createLeadValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<LeadDto>(errorMessage);
            }
            if (dto.PropertyId.HasValue)
            {

                var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
                var propertyExists = await queryRepo
                    .Queryable()
                    .AnyAsync(p => p.Id == dto.PropertyId.Value);
                if (!propertyExists)
                    return new Response<LeadDto>("Invalid property reference. The specified property does not exist.");
            }

            var lead = _mapper.Map<Domain.LeadEntity.Lead>(dto);
            lead.Status = LeadStatus.New;
            lead.CreatedAt = DateTime.UtcNow;

            await _uow.RepositoryAsync<Domain.LeadEntity.Lead>().AddAsync(lead);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await IncrementLeadVersionAsync();

            var adminUserIds = await _userService.GetAllAdminAndSuperAdminUserIds();
            var adminUserGuids = adminUserIds
                .Where(id => Guid.TryParse(id, out _))
                .Select(id => Guid.Parse(id))
                .ToList();

            Console.WriteLine($"Sending notification to userIds: {string.Join(", ", adminUserGuids)}");

            await _notificationService.CreateAndDispatchAsync(
                "New Lead Submitted",
                $"Lead inquiry submitted by {dto.FullName} email {dto.Email}.",
                adminUserGuids
            );

            var responseDto = _mapper.Map<LeadDto>(lead);
            return new Response<LeadDto>(responseDto, "Inquiry submitted successfully.");
        }

        public async Task<Response<PaginatedResponse<LeadDto>>> GetPaginatedAsync(int pageNumber, int pageSize, LeadFilterDto filters, bool isExport)
        {
            string versionKey = "leads:version";
            string? version = await _cache.GetStringAsync(versionKey);
            if (string.IsNullOrEmpty(version))
            {
                version = "1";
                await _cache.SetStringAsync(versionKey, version);
            }

            string cacheKey = LeadServiceHelper.BuildCacheKey(version, pageNumber, pageSize, filters);
            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached) && !isExport)
            {
                var cachedResult = JsonConvert.DeserializeObject<PaginatedResponse<LeadDto>>(cached);
                if (cachedResult != null)
                {
                    return new Response<PaginatedResponse<LeadDto>>(cachedResult, "Leads retrieved successfully");
                }
            }

            var repo = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>();
            var query = repo.Queryable();
            query = LeadServiceHelper.ApplyFilters(query, filters);
            query = query.OrderByDescending(b => b.CreatedAt);

            // Paginated data
            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            var dtoList = _mapper.Map<List<LeadDto>>(items);
            var paged = new PaginatedResponse<LeadDto>(dtoList, total, pageNumber, pageSize);

            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(paged), cacheOptions);

            // Export logic
            if (isExport)
            {
                var allItems = await query.ToListAsync();
                var allDtoList = _mapper.Map<List<LeadDto>>(allItems);
                var excelBytes = LeadServiceHelper.GenerateExcelReport(allDtoList);

                string base64Excel = Convert.ToBase64String(excelBytes);

                paged.Extra = new Dictionary<string, object>
                {
                    ["exportFileBase64"] = base64Excel,
                    ["fileName"] = $"leads_report_{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx"
                };
            }

            return new Response<PaginatedResponse<LeadDto>>(paged, "Leads retrieved successfully");
        }

        public async Task<Response<LeadDto>> GetByIdAsync(int id)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>();
            var lead = await repo.Queryable().FirstOrDefaultAsync(b => b.Id == id);
            if (lead == null) return new Response<LeadDto>("Lead not found");
            return new Response<LeadDto>(_mapper.Map<LeadDto>(lead));
        }

        public async Task<Response<LeadDto>> UpdateLeadAsync(UpdateLeadDto dto)
        {
            var validationResult = await _updateLeadValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<LeadDto>(errorMessage);
            }

            var repo = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>();
            var lead = await repo.Queryable().FirstOrDefaultAsync(b => b.Id == dto.id);

            if (lead == null)
            {
                return new Response<LeadDto>("Lead not found");
            }

            _mapper.Map(dto, lead);
            await _uow.RepositoryAsync<Domain.LeadEntity.Lead>().UpdateAsync(lead);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await IncrementLeadVersionAsync();

            return new Response<LeadDto>(_mapper.Map<LeadDto>(lead), "Lead updated successfully.");
        }


        private async Task IncrementLeadVersionAsync()
        {
            string versionKey = "leads:version";
            string? currentVersion = await _cache.GetStringAsync(versionKey);
            int newVersion = 1;
            if (!string.IsNullOrEmpty(currentVersion) && int.TryParse(currentVersion, out int parsedVersion))
            {
                newVersion = parsedVersion + 1;
            }
            await _cache.SetStringAsync(versionKey, newVersion.ToString());
        }

        public async Task<Response<LeadDashboardStatsDto>> GetLeadDashboardStatsAsync()
        {
            string cacheKey = "lead:dashboard:stats";
            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var dtoData = JsonConvert.DeserializeObject<LeadDashboardStatsDto>(cached);
                if (dtoData != null)
                {
                    return new Response<LeadDashboardStatsDto>(dtoData, "Lead dashboard stats loaded");
                }
            }

            var query = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>().Queryable();
            var now = DateTime.UtcNow;
            var currentMonthStart = new DateTime(now.Year, now.Month, 1);

            var total = await query.CountAsync();
            var leadsThisMonth = await query.CountAsync(l => l.CreatedAt >= currentMonthStart);

            var active = await query.CountAsync(l => l.Status != LeadStatus.Rejected && l.Status != LeadStatus.Converted);

            var newLeads = await query.CountAsync(l => l.Status == LeadStatus.New);
            var contacted = await query.CountAsync(l => l.Status == LeadStatus.Contacted);
            var inDiscussion = await query.CountAsync(l => l.Status == LeadStatus.InDiscussion);
            var visitScheduled = await query.CountAsync(l => l.Status == LeadStatus.VisitScheduled);
            var converted = await query.CountAsync(l => l.Status == LeadStatus.Converted);
            var rejected = await query.CountAsync(l => l.Status == LeadStatus.Rejected);

            var dto = new LeadDashboardStatsDto
            {
                TotalLeads = total,
                LeadsThisMonth = leadsThisMonth,
                ActiveLeads = active,
                NewLeads = newLeads,
                Contacted = contacted,
                InDiscussion = inDiscussion,
                VisitScheduled = visitScheduled,
                Converted = converted,
                Rejected = rejected
            };

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(dto), options);

            return new Response<LeadDashboardStatsDto>(dto, "Lead dashboard stats loaded");
        }

        public async Task<Response<LeadDto>> ChangeStatusAsync(UpdateLeadStatusDto dto)
        {
            var repo = _uow.RepositoryAsync<Domain.LeadEntity.Lead>();
            var lead = await _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>()
                .Queryable()
                .FirstOrDefaultAsync(p => p.Id == dto.id);

            if (lead == null)
                return new Response<LeadDto>("Lead not found");

            var currentStatus = lead.Status;

            var allowedTransitions = new Dictionary<LeadStatus, LeadStatus[]>
            {
                { LeadStatus.New,             new[] { LeadStatus.Contacted, LeadStatus.Rejected } },
                { LeadStatus.Contacted,       new[] { LeadStatus.InDiscussion, LeadStatus.Rejected } },
                { LeadStatus.InDiscussion,    new[] { LeadStatus.VisitScheduled, LeadStatus.Rejected } },
                { LeadStatus.VisitScheduled,  new[] { LeadStatus.Converted, LeadStatus.Rejected } },
                { LeadStatus.Converted,       Array.Empty<LeadStatus>() },
                { LeadStatus.Rejected,        Array.Empty<LeadStatus>() }
            };

            if (!dto.status.HasValue)
                return new Response<LeadDto>("Status cannot be null");

            if (!allowedTransitions.TryGetValue(currentStatus, out var validNextStatuses) ||
                !validNextStatuses.Contains(dto.status.Value))
            {
                return new Response<LeadDto>($"Invalid status transition from {currentStatus} to {dto.status.Value}");
            }

            lead.Status = dto.status.Value;
            lead.UpdatedAt = DateTime.UtcNow;

            await repo.UpdateAsync(lead);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<LeadDto>(lead);
            await IncrementLeadVersionAsync();

            return new Response<LeadDto>(updatedDto, $"Status updated successfully from {currentStatus} to {dto.status.Value}");
        }
    }
}