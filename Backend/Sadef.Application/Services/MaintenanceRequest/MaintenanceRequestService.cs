using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;
using Sadef.Domain.MaintenanceRequestEntity;

namespace Sadef.Application.Services.MaintenanceRequest
{
    public class MaintenanceRequestService : IMaintenanceRequestService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateMaintenanceRequestDto> _validator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;

        public MaintenanceRequestService(
            IUnitOfWorkAsync uow,
            IMapper mapper,
            IValidator<CreateMaintenanceRequestDto> validator,
            IQueryRepositoryFactory queryRepositoryFactory)
        {
            _uow = uow;
            _mapper = mapper;
            _validator = validator;
            _queryRepositoryFactory = queryRepositoryFactory;
        }

        public async Task<Response<MaintenanceRequestDto>> CreateRequestAsync(CreateMaintenanceRequestDto dto)
        {
            var validation = await _validator.ValidateAsync(dto);
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

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
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
    }
}
