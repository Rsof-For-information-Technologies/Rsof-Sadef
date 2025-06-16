using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using ClosedXML.Excel;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.DTOs.PropertyDtos;
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
        private readonly IDistributedCache _cache;

        public LeadService(IUnitOfWorkAsync uow, IMapper mapper, IValidator<CreateLeadDto> createLeadValidator, IQueryRepositoryFactory queryRepositoryFactory, IValidator<UpdateLeadDto> updateLeadValidator, IDistributedCache cache)
        {
            _uow = uow;
            _mapper = mapper;
            _createLeadValidator = createLeadValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updateLeadValidator = updateLeadValidator;
            _cache = cache;
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

            var responseDto = _mapper.Map<LeadDto>(lead);
            return new Response<LeadDto>(responseDto, "Inquiry submitted successfully.");
        }

        public async Task<Response<PaginatedResponse<LeadDto>>> GetPaginatedAsync(int pageNumber, int pageSize, LeadFilterDto filters)
        {
            string versionKey = "leads:version";
            string? version = await _cache.GetStringAsync(versionKey); 
            if (string.IsNullOrEmpty(version))
            {
                version = "1";
                await _cache.SetStringAsync(versionKey, version);
            }

            string cacheKey = $"leads:version={version}:page={pageNumber}&size={pageSize}" +
                $"&name={filters.FullName}" +
                $"&email={filters.Email}" +
                $"&phone={filters.Phone}" +
                $"&prop={filters.PropertyId}" +
                $"&status={filters.Status}" +
                $"&from={filters.CreatedAtFrom?.ToString("yyyyMMdd")}" +
                $"&to={filters.CreatedAtTo?.ToString("yyyyMMdd")}";

            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var cachedResult = JsonConvert.DeserializeObject<PaginatedResponse<LeadDto>>(cached);
                if (cachedResult != null)
                {
                    return new Response<PaginatedResponse<LeadDto>>(cachedResult, "Leads retrieved successfully");
                }
            }

            var repo = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>();
            var query = repo.Queryable();

            if (!string.IsNullOrWhiteSpace(filters.FullName))
                query = query.Where(x => x.FullName.Contains(filters.FullName));

            if (!string.IsNullOrWhiteSpace(filters.Email))
                query = query.Where(x => x.Email.Contains(filters.Email));

            if (!string.IsNullOrWhiteSpace(filters.Phone))
                query = query.Where(x => x.Phone == filters.Phone);

            if (filters.PropertyId.HasValue)
                query = query.Where(x => x.PropertyId == filters.PropertyId);

            if (!string.IsNullOrWhiteSpace(filters.Status) && Enum.TryParse<LeadStatus>(filters.Status, true, out var statusEnum))
                query = query.Where(x => x.Status == statusEnum);

            if (filters.CreatedAtFrom.HasValue)
                query = query.Where(x => x.CreatedAt >= filters.CreatedAtFrom.Value);

            if (filters.CreatedAtTo.HasValue)
                query = query.Where(x => x.CreatedAt <= filters.CreatedAtTo.Value);

            query = query.OrderByDescending(b => b.CreatedAt);
            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            var dtoList = _mapper.Map<List<LeadDto>>(items);
            var paged = new PaginatedResponse<LeadDto>(dtoList, total, pageNumber, pageSize);

            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(paged), cacheOptions);
            return new Response<PaginatedResponse<LeadDto>>(paged);
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

            if (!string.IsNullOrWhiteSpace(dto.FullName))
                lead.FullName = dto.FullName;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                lead.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Phone))
                lead.Phone = dto.Phone;

            if (!string.IsNullOrWhiteSpace(dto.Message))
                lead.Message = dto.Message;

            if (dto.PropertyId.HasValue)
                lead.PropertyId = dto.PropertyId;

            if (dto.Status.HasValue)
                lead.Status = dto.Status.Value;

            lead.UpdatedAt = DateTime.UtcNow;

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
        public async Task<byte[]> ExportLeadDashboardStatsToExcelAsync()
        {
            var statsResponse = await GetLeadDashboardStatsAsync();
            if (!statsResponse.Succeeded || statsResponse.Data == null)
                return Array.Empty<byte>();

            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Lead Stats");

            worksheet.Cell(1, 1).Value = "Total Leads";
            worksheet.Cell(1, 2).Value = "Leads This Month";
            worksheet.Cell(1, 3).Value = "Active Leads";
            worksheet.Cell(1, 4).Value = "New Leads";
            worksheet.Cell(1, 5).Value = "Contacted";
            worksheet.Cell(1, 6).Value = "In Discussion";
            worksheet.Cell(1, 7).Value = "Visit Scheduled";
            worksheet.Cell(1, 8).Value = "Converted";
            worksheet.Cell(1, 9).Value = "Rejected";

            var stats = statsResponse.Data;
            worksheet.Cell(2, 1).Value = stats.TotalLeads;
            worksheet.Cell(2, 2).Value = stats.LeadsThisMonth;
            worksheet.Cell(2, 3).Value = stats.ActiveLeads;
            worksheet.Cell(2, 4).Value = stats.NewLeads;
            worksheet.Cell(2, 5).Value = stats.Contacted;
            worksheet.Cell(2, 6).Value = stats.InDiscussion;
            worksheet.Cell(2, 7).Value = stats.VisitScheduled;
            worksheet.Cell(2, 8).Value = stats.Converted;
            worksheet.Cell(2, 9).Value = stats.Rejected;

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        }
    }
}