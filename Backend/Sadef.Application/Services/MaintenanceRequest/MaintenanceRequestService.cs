using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;
using Sadef.Domain.MaintenanceRequestEntity;

namespace Sadef.Application.Services.MaintenanceRequest
{
    public class MaintenanceRequestService : IMaintenanceRequestService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateMaintenanceRequestDto> _createMaintenanceRequestValidator;
        private readonly IValidator<UpdateMaintenanceRequestStatusDto> _updateMaintenanceRequestStatusValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IDistributedCache _cache;

        public MaintenanceRequestService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateMaintenanceRequestDto> createMaintenanceRequestValidator,
            IValidator<UpdateMaintenanceRequestStatusDto> updateMaintenanceRequestStatusValidator,
            IQueryRepositoryFactory queryRepositoryFactory,
            IDistributedCache cache)
        {
            _uow = uow;
            _mapper = mapper;
            _createMaintenanceRequestValidator = createMaintenanceRequestValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updateMaintenanceRequestStatusValidator = updateMaintenanceRequestStatusValidator;
            _cache = cache;
        }

        public async Task<Response<MaintenanceRequestDto>> CreateRequestAsync(CreateMaintenanceRequestDto dto)
        {
            var validation = await _createMaintenanceRequestValidator.ValidateAsync(dto);
            if (!validation.IsValid)
                return new Response<MaintenanceRequestDto>(validation.Errors.First().ErrorMessage);

            var leadQuery = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>();
            var lead = await leadQuery.Queryable()
                .FirstOrDefaultAsync(l => l.Id == dto.LeadId);

            if (lead == null)
                return new Response<MaintenanceRequestDto>($"No lead found with the provided LeadId: {dto.LeadId}. Please enter a valid LeadId.");

            if (lead.Status != LeadStatus.Converted)
                return new Response<MaintenanceRequestDto>("Only converted leads can submit maintenance requests.");

            var request = _mapper.Map<Domain.MaintenanceRequestEntity.MaintenanceRequest>(dto);
            request.Images = new List<MaintenanceImage>();
            if (dto.Images != null)
            {
                foreach (var file in dto.Images)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var image = new MaintenanceImage
                    {
                        ImageData = ms.ToArray(),
                        ContentType = file.ContentType
                    };
                    request.Images.Add(image);
                }
            }

            request.Videos = new List<MaintenanceVideo>();
            if (dto.Videos != null)
            {
                foreach (var file in dto.Videos)
                {
                    using var ms = new MemoryStream();
                    await file.CopyToAsync(ms);
                    var video = new MaintenanceVideo
                    {
                        VideoData = ms.ToArray(),
                        ContentType = file.ContentType
                    };
                    request.Videos.Add(video);
                }
            }

            request.Status = MaintenanceRequestStatus.Pending;
            request.CreatedAt = DateTime.UtcNow;
            request.CreatedBy = "system";

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().AddAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            responseDto.ImageBase64Strings = request.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();
            responseDto.VideoUrls = request.Videos?
                .Select(video => $"data:{video.ContentType};base64,{Convert.ToBase64String(video.VideoData)}")
                .ToList() ?? new();

            return new Response<MaintenanceRequestDto>(responseDto, "Maintenance request submitted successfully.");
        }
        public async Task<Response<PaginatedResponse<MaintenanceRequestDto>>> GetPaginatedAsync(int pageNumber, int pageSize, MaintenanceRequestFilterDto filters)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var query = repo.Queryable();
            query = MaintenanceRequestHelper.ApplyFilters(query, filters);

            var total = await query.CountAsync();
            var items = await query
                .Include(r => r.Images!)
                .Include(r => r.Videos!)
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtoList = items.Select(item =>
            {
                var dto = _mapper.Map<MaintenanceRequestDto>(item);
                dto.ImageBase64Strings = item.Images?
                    .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                    .ToList() ?? new();
                dto.VideoUrls = item.Videos?
                    .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                    .ToList() ?? new();
                return dto;
            }).ToList();

            var paged = new PaginatedResponse<MaintenanceRequestDto>(dtoList, total, pageNumber, pageSize);
            return new Response<PaginatedResponse<MaintenanceRequestDto>>(paged, "Maintenance requests retrieved successfully.");
        }

        public async Task<Response<MaintenanceRequestDto>> GetByIdAsync(int id)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();

            var request = await repo.Queryable()
                .Include(r => r.Images!)
                .Include(r => r.Videos!)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return new Response<MaintenanceRequestDto>("Maintenance request not found");

            var dto = _mapper.Map<MaintenanceRequestDto>(request);

            dto.ImageBase64Strings = request.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();

            dto.VideoUrls = request.Videos?
                .Select(vid => $"data:{vid.ContentType};base64,{Convert.ToBase64String(vid.VideoData)}")
                .ToList() ?? new();

            return new Response<MaintenanceRequestDto>(dto, "Maintenance request found successfully");
        }

        public async Task<Response<MaintenanceRequestDashboardStatsDto>> GetDashboardStatsAsync()
        {
            string cacheKey = "maintenancerequest:dashboard:stats";
            var cached = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cached))
            {
                var dtoData = JsonConvert.DeserializeObject<MaintenanceRequestDashboardStatsDto>(cached);
                if (dtoData != null)
                {
                    return new Response<MaintenanceRequestDashboardStatsDto>(dtoData, "Maintenance dashboard stats loaded");
                }
            }

            var query = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>().Queryable();
            var now = DateTime.UtcNow;
            var currentMonthStart = new DateTime(now.Year, now.Month, 1);

            var total = await query.CountAsync();
            var requestsThisMonth = await query.CountAsync(r => r.CreatedAt >= currentMonthStart);

            var pending = await query.CountAsync(r => r.Status == MaintenanceRequestStatus.Pending);
            var inProgress = await query.CountAsync(r => r.Status == MaintenanceRequestStatus.InProgress);
            var resolved = await query.CountAsync(r => r.Status == MaintenanceRequestStatus.Resolved);
            var rejected = await query.CountAsync(r => r.Status == MaintenanceRequestStatus.Rejected);

            var dto = new MaintenanceRequestDashboardStatsDto
            {
                TotalRequests = total,
                RequestsThisMonth = requestsThisMonth,
                Pending = pending,
                InProgress = inProgress,
                Resolved = resolved,
                Rejected = rejected
            };

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(dto), options);

            return new Response<MaintenanceRequestDashboardStatsDto>(dto, "Maintenance dashboard stats loaded");
        }
        public async Task<Response<bool>> UpdateStatusAsync(UpdateMaintenanceRequestStatusDto dto)
        {
            var validationResult = await _updateMaintenanceRequestStatusValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;

                return new Response<bool>
                {
                    Succeeded = false,
                    Message = errorMessage,
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var repo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await repo.Queryable().FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (request == null)
                return new Response<bool>("Maintenance request not found");

            _mapper.Map(dto, request);
            request.UpdatedAt = DateTime.UtcNow;

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            return new Response<bool>(true, "Maintenance request status updated successfully.");
        }

    }
}
