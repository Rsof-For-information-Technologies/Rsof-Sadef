using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
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
        private readonly IValidator<UpdateMaintenanceRequestDto> _updateMaintenanceRequestStatusValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IDistributedCache _cache;
        private readonly IStringLocalizer _localizer;
        private readonly IConfiguration _configuration;

        public MaintenanceRequestService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateMaintenanceRequestDto> createMaintenanceRequestValidator,
            IValidator<UpdateMaintenanceRequestDto> updateMaintenanceRequestStatusValidator,
            IQueryRepositoryFactory queryRepositoryFactory,
            IDistributedCache cache,
            IStringLocalizerFactory localizerFactory,
            IConfiguration configuration
        )
        {
            _uow = uow;
            _mapper = mapper;
            _createMaintenanceRequestValidator = createMaintenanceRequestValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updateMaintenanceRequestStatusValidator = updateMaintenanceRequestStatusValidator;
            _cache = cache;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
            _configuration = configuration;
        }

        public async Task<Response<MaintenanceRequestDto>> CreateRequestAsync(CreateMaintenanceRequestDto dto)
        {
            var validation = await _createMaintenanceRequestValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                var errorMessage = validation.Errors.First().ErrorMessage;
                return new Response<MaintenanceRequestDto>
                {
                    Succeeded = false,
                    Message = errorMessage,
                    ValidationResultModel = new ValidationResultModel(validation)
                };
            }

            var leadQuery = _queryRepositoryFactory.QueryRepository<Domain.LeadEntity.Lead>();
            var lead = await leadQuery.Queryable().FirstOrDefaultAsync(l => l.Id == dto.LeadId);
            if (lead == null)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_LeadNotFound", dto.LeadId].ToString());

            if (lead.Status != LeadStatus.Converted)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_LeadNotConverted"].ToString());

            var request = _mapper.Map<Domain.MaintenanceRequestEntity.MaintenanceRequest>(dto);
            request.Status = MaintenanceRequestStatus.Pending;
            request.CreatedAt = DateTime.UtcNow;
            request.CreatedBy = "system";
            request.Images = new List<MaintenanceImage>();
            request.Videos = new List<MaintenanceVideo>();

            var basePath = _configuration["UploadSettings:MaintenanceRequestMedia"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "maintenance");
            var virtualPathBase = "uploads/maintenance";

            if (dto.Images != null)
            {
                var imageResults = await FileUploadHelper.SaveFilesAsync(dto.Images, basePath, "img", virtualPathBase);
                request.Images = imageResults.Select(x => new MaintenanceImage
                {
                    ContentType = x.ContentType,
                    ImageUrl = x.Url
                }).ToList();
            }

            if (dto.Videos != null)
            {
                var videoResults = await FileUploadHelper.SaveFilesAsync(dto.Videos, basePath, "vid", virtualPathBase);
                request.Videos = videoResults.Select(x => new MaintenanceVideo
                {
                    ContentType = x.ContentType,
                    VideoUrl = x.Url
                }).ToList();
            }

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().AddAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            return new Response<MaintenanceRequestDto>(responseDto, _localizer["MaintenanceRequest_Created"]);
        }
        public async Task<Response<PaginatedResponse<MaintenanceRequestDto>>> GetPaginatedAsync(int pageNumber, int pageSize, MaintenanceRequestFilterDto filters)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var query = MaintenanceRequestHelper.ApplyFilters(repo.Queryable(), filters);

            var totalCount = await query.CountAsync();

            var paginatedItems = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtoList = _mapper.Map<List<MaintenanceRequestDto>>(paginatedItems);

            var paginatedResponse = new PaginatedResponse<MaintenanceRequestDto>(
                dtoList,
                totalCount,
                pageNumber,
                pageSize
            );

            return new Response<PaginatedResponse<MaintenanceRequestDto>>(
                paginatedResponse,
                _localizer["MaintenanceRequest_Listed"]
            );
        }

        public async Task<Response<MaintenanceRequestDto>> GetByIdAsync(int id)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();

            var request = await repo.Queryable()
                .Include(r => r.Images!)
                .Include(r => r.Videos!)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_NotFound"]);

            var dto = _mapper.Map<MaintenanceRequestDto>(request);
            dto.ImageUrls = request.Images?.Select(img => img.ImageUrl).ToList() ?? new();
            dto.VideoUrls = request.Videos?.Select(vid => vid.VideoUrl).ToList() ?? new();

            return new Response<MaintenanceRequestDto>(dto, _localizer["MaintenanceRequest_Found"]);
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
                    return new Response<MaintenanceRequestDashboardStatsDto>(dtoData, _localizer["MaintenanceRequest_DashboardLoaded"]);
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

            return new Response<MaintenanceRequestDashboardStatsDto>(dto, _localizer["MaintenanceRequest_DashboardLoaded"]);
        }
        public async Task<Response<MaintenanceRequestDto>> UpdateMaintenanceRequestAsync(UpdateMaintenanceRequestDto dto)
        {
            var validationResult = await _updateMaintenanceRequestStatusValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<MaintenanceRequestDto>
                {
                    Succeeded = false,
                    Message = errorMessage,
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var repo = _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>()
                .Queryable()
                .Include(r => r.Images)
                .Include(r => r.Videos)
                .FirstOrDefaultAsync(r => r.Id == dto.Id);

            if (request == null)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_NotFound"]);

            request.Description = dto.Description;
            request.UpdatedAt = DateTime.UtcNow;

            var basePath = _configuration["UploadSettings:MaintenanceRequestMedia"] ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "maintenance");
            var virtualPathBase = "uploads/maintenance";

            // Clear existing images if new ones are uploaded
            if (dto.Images != null && dto.Images.Any())
            {
                if (request.Images != null && request.Images.Any())
                {
                    var oldImagePaths = request.Images.Select(x => x.ImageUrl);
                    FileUploadHelper.DeleteFiles(oldImagePaths);
                }

                var imageResults = await FileUploadHelper.SaveFilesAsync(dto.Images, basePath, "img", virtualPathBase);
                request.Images = imageResults.Select(x => new MaintenanceImage
                {
                    ContentType = x.ContentType,
                    ImageUrl = x.Url
                }).ToList();
            }

            if (dto.Videos != null && dto.Videos.Any())
            {
                if (request.Videos != null && request.Videos.Any())
                {
                    var oldVideoPaths = request.Videos.Select(x => x.VideoUrl);
                    FileUploadHelper.DeleteFiles(oldVideoPaths);
                }

                var videoResults = await FileUploadHelper.SaveFilesAsync(dto.Videos, basePath, "vid", virtualPathBase);
                request.Videos = videoResults.Select(x => new MaintenanceVideo
                {
                    ContentType = x.ContentType,
                    VideoUrl = x.Url
                }).ToList();
            }

            await repo.UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            return new Response<MaintenanceRequestDto>(responseDto, _localizer["MaintenanceRequest_Updated"]);
        }

        public async Task<Response<string>> DeleteMaintenanceRequestAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await queryRepo
                .Queryable()
                .Include(p => p.Images!)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (request == null)
                return new Response<string>(_localizer["MaintenanceRequest_NotFound"]);
            request.IsActive = false; // Soft delete

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");
            var response = new Response<string>(_localizer["MaintenanceRequest_Deleted"]);
            response.Succeeded = true;
            return response;
        }

        public async Task<Response<MaintenanceRequestDto>> UpdateStatusAsync(UpdateMaintenanceRequestStatusDto dto)
        {
            var repo = _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>()
                .Queryable()
                .FirstOrDefaultAsync(m => m.Id == dto.Id);

            if (request == null)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_NotFound"]);

            if (!request.Status.HasValue)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_StatusNotSet"]);

            if (!dto.Status.HasValue)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_StatusRequired"]);

            var currentStatus = request.Status.Value;
            var newStatus = dto.Status.Value;

            if (!MaintenanceRequestHelper.IsValidStatusTransition(currentStatus, newStatus, out var errorMessage))
            {
                return new Response<MaintenanceRequestDto>(_localizer[errorMessage!]);
            }

            request.Status = newStatus;
            request.UpdatedAt = DateTime.UtcNow;

            await repo.UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<MaintenanceRequestDto>(request);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            return new Response<MaintenanceRequestDto>(updatedDto, _localizer["MaintenanceRequest_StatusUpdated", currentStatus, newStatus]);
        }

        public async Task<Response<MaintenanceRequestDto>> UpdateAdminResponseAsync(UpdateAdminResponseDto dto)
        {
            var repo = _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>()
                .Queryable()
                .FirstOrDefaultAsync(m => m.Id == dto.Id);

            if (request == null)
                return new Response<MaintenanceRequestDto>(_localizer["MaintenanceRequest_NotFound"]);

            if (dto.AdminResponse != null)
                request.AdminResponse = dto.AdminResponse;

            if (dto.Status.HasValue)
            {
                var currentStatus = request.Status.GetValueOrDefault();
                var newStatus = dto.Status.GetValueOrDefault();

                if (!MaintenanceRequestHelper.IsValidStatusTransition(currentStatus, newStatus, out var errorMessage))
                {
                    return new Response<MaintenanceRequestDto>(_localizer[errorMessage!]);
                }
                request.Status = dto.Status.Value;
            }

            request.UpdatedAt = DateTime.UtcNow;

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            return new Response<MaintenanceRequestDto>(responseDto, _localizer["MaintenanceRequest_AdminResponseUpdated"]);
        }
        public async Task<Response<List<MaintenanceRequestDto>>> GetMyMaintenanceRequestsAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return new Response<List<MaintenanceRequestDto>>("Invalid user email");

            var repo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();

            var requests = await repo.Queryable()
                .Where(m => m.CreatedBy == email)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            var dtoList = _mapper.Map<List<MaintenanceRequestDto>>(requests);

            return new Response<List<MaintenanceRequestDto>>(dtoList, "Maintenance requests created by user retrieved successfully.");
        }

    }
}
