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
        private readonly IValidator<UpdateMaintenanceRequestDto> _updateMaintenanceRequestStatusValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IDistributedCache _cache;

        public MaintenanceRequestService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateMaintenanceRequestDto> createMaintenanceRequestValidator,
            IValidator<UpdateMaintenanceRequestDto> updateMaintenanceRequestStatusValidator,
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
                "Maintenance requests retrieved successfully."
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
                return new Response<MaintenanceRequestDto>("Maintenance request not found");

            request.Description = dto.Description;
            request.UpdatedAt = DateTime.UtcNow;

            if (dto.Images != null && dto.Images.Any())
                request.Images?.Clear();

            if (dto.Videos != null && dto.Videos.Any())
                request.Videos?.Clear();

            if (dto.Images != null)
            {
                request.Images ??= new List<MaintenanceImage>();
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

            if (dto.Videos != null)
            {
                request.Videos ??= new List<MaintenanceVideo>();
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

            await repo.UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            responseDto.ImageBase64Strings = request.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();

            responseDto.VideoUrls = request.Videos?
                .Select(video => $"data:{video.ContentType};base64,{Convert.ToBase64String(video.VideoData)}")
                .ToList() ?? new();

            return new Response<MaintenanceRequestDto>(responseDto, "Maintenance request updated successfully.");
        }

        public async Task<Response<string>> DeleteMaintenanceRequestAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await queryRepo
                .Queryable()
                .Include(p => p.Images!)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (request == null)
                return new Response<string>("Maintenance Request not found");
            request.IsActive = false; // Soft delete

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");
            var response = new Response<string>("Request deleted successfully");
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
                return new Response<MaintenanceRequestDto>("Maintenance request not found");

            if (!request.Status.HasValue)
                return new Response<MaintenanceRequestDto>("Current status is not set for this request");

            if (!dto.Status.HasValue)
                return new Response<MaintenanceRequestDto>("New status cannot be null");

            var currentStatus = request.Status.Value;
            var newStatus = dto.Status.Value;

            if (!MaintenanceRequestHelper.IsValidStatusTransition(currentStatus, newStatus, out var errorMessage))
            {
                return new Response<MaintenanceRequestDto>(errorMessage!);
            }

            request.Status = newStatus;
            request.UpdatedAt = DateTime.UtcNow;

            await repo.UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<MaintenanceRequestDto>(request);
            await _cache.RemoveAsync("maintenancerequest:dashboard:stats");

            return new Response<MaintenanceRequestDto>(updatedDto, $"Status updated from {currentStatus} to {newStatus}");
        }

        public async Task<Response<MaintenanceRequestDto>> UpdateAdminResponseAsync(UpdateAdminResponseDto dto)
        {
            var repo = _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>();
            var request = await _queryRepositoryFactory.QueryRepository<Domain.MaintenanceRequestEntity.MaintenanceRequest>()
                .Queryable()
                .FirstOrDefaultAsync(m => m.Id == dto.Id);

            if (request == null)
                return new Response<MaintenanceRequestDto>("Maintenance request not found");

            if (dto.AdminResponse != null)
                request.AdminResponse = dto.AdminResponse;

            if (dto.Status.HasValue)
            {
                var currentStatus = request.Status.GetValueOrDefault();
                var newStatus = dto.Status.GetValueOrDefault();

                if (!MaintenanceRequestHelper.IsValidStatusTransition(currentStatus, newStatus, out var errorMessage))
                {
                    return new Response<MaintenanceRequestDto>(errorMessage!);
                }
                request.Status = dto.Status.Value;
            }

            request.UpdatedAt = DateTime.UtcNow;

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().UpdateAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            return new Response<MaintenanceRequestDto>(responseDto, "Updated successfully.");
        }

    }
}
