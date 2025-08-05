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

        public PropertyService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IValidator<UpdatePropertyDto> updatePropertyValidator, IValidator<CreatePropertyDto> createPropertyDto , IDistributedCache cache, IValidator<PropertyExpiryUpdateDto> expireValidator, IStringLocalizerFactory localizerFactory)
        {
            _uow = uow;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updatePropertyValidator = updatePropertyValidator;
            _createPropertyValidator = createPropertyDto;
            _cache = cache;
            _expireValidator = expireValidator;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
        }

        public async Task<Response<PropertyDto>> CreatePropertyAsync(CreatePropertyDto dto)
        {
            var validationResult = await _createPropertyValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<PropertyDto>(errorMessage);
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
            await _uow.RepositoryAsync<Property>().AddAsync(property);
            await _uow.SaveChangesAsync(CancellationToken.None);
            await _cache.RemoveAsync("property:page=1&size=10");
            var createdDto = _mapper.Map<PropertyDto>(property);
            createdDto.ImageBase64Strings = property.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();
            createdDto.VideoUrls = property.Videos?
                .Select(v => $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}")
                .ToList() ?? new();
            return new Response<PropertyDto>(createdDto, _localizer["Property_Created"]);
        }


        public async Task<Response<PaginatedResponse<PropertyDto>>> GetAllPropertiesAsync(PaginationRequest request)
        {
            string cacheKey = $"property:page={request.PageNumber}&size={request.PageSize}";
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

            var result = items.Select(p =>
            {
                var dto = _mapper.Map<PropertyDto>(p);
                dto.ImageBase64Strings = p.Images?.Select(img =>
                    $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();
                dto.VideoUrls = p.Videos?.Select(v =>
                    $"data:{v.ContentType};base64,{Convert.ToBase64String(v.VideoData)}").ToList() ?? new();
                return dto;
            }).ToList();

            var paged = new PaginatedResponse<PropertyDto>(result, totalCount, request.PageNumber, request.PageSize);

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
            await _cache.RemoveAsync("property:page=1&size=10");
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
            await _cache.RemoveAsync("property:page=1&size=10");
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
            await _cache.RemoveAsync("property:page=1&size=10");
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
            await _cache.RemoveAsync("property:page=1&size=10");
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
               .Where(p =>
                   (p.IsActive.HasValue && p.IsActive.Value) &&
                   (!p.ExpiryDate.HasValue || p.ExpiryDate > now)
               )
               .CountAsync();

            var dto = new PropertyDashboardStatsDto
            {
                TotalProperties = total,
                ActiveProperties = activeProperties,
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
                UnitCategoryCounts = unitCategoryCounts
            };

            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
            };
            await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(dto), options);

            return new Response<PropertyDashboardStatsDto>(dto, _localizer["Property_DashboardLoaded"]);
        }
    }
}
