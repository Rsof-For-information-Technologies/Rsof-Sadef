using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
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

        public PropertyService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IValidator<UpdatePropertyDto> updatePropertyValidator, IValidator<CreatePropertyDto> createPropertyDto)
        {
            _uow = uow;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updatePropertyValidator = updatePropertyValidator;
            _createPropertyValidator = createPropertyDto;
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

            await _uow.RepositoryAsync<Property>().AddAsync(property);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var createdDto = _mapper.Map<PropertyDto>(property);
            createdDto.ImageBase64Strings = property.Images?
                .Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}")
                .ToList() ?? new();

            return new Response<PropertyDto>(createdDto, "Property created successfully");
        }


        public async Task<Response<PaginatedResponse<PropertyDto>>> GetAllPropertiesAsync(PaginationRequest request)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var query = queryRepo.Queryable().Include(p => p.Images!);

            var totalCount = await query.CountAsync();
            var items = await query
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

            var paged = new PaginatedResponse<PropertyDto>(result, totalCount, request.PageNumber, request.PageSize);
            return new Response<PaginatedResponse<PropertyDto>>(paged, "Paged properties retrieved successfully");

        }

        public async Task<Response<PropertyDto>> GetPropertyByIdAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var property = await queryRepo
                .Queryable()
                .Include(p => p.Images!)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return new Response<PropertyDto>("Property not found");

            var dto = _mapper.Map<PropertyDto>(property);
            dto.ImageBase64Strings = property.Images?.Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();

            return new Response<PropertyDto>(dto, "Property found successfully");
        }

        public async Task<Response<string>> DeletePropertyAsync(int id)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Property>();
            var property = await queryRepo
                .Queryable()
                .Include(p => p.Images!)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return new Response<string>("Property not found");

            await _uow.RepositoryAsync<Property>().DeleteAsync(property);
            await _uow.SaveChangesAsync(CancellationToken.None);

            return new Response<string>("Property deleted successfully");
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
                return new Response<PropertyDto>("Property not found");

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

            await _uow.RepositoryAsync<Property>().UpdateAsync(existing);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var updatedDto = _mapper.Map<PropertyDto>(existing);
            updatedDto.ImageBase64Strings = existing.Images?.Select(img => $"data:{img.ContentType};base64,{Convert.ToBase64String(img.ImageData)}").ToList() ?? new();

            return new Response<PropertyDto>(updatedDto, "Property updated successfully");
        }
    }
}
