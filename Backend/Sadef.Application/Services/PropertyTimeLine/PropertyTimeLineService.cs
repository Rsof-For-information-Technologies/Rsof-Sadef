using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.PropertyTimeLineDtos;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Validator;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Common.Services.CurrentUser;
using Sadef.Domain.Constants;

namespace Sadef.Application.Services.PropertyTimeLine
{
    public class PropertyTimeLineService : IPropertyTimeLineService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUserService;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IValidator<CreatePropertyTimeLineLogDto> _createPropertyTimeLineLogValidator;

        public PropertyTimeLineService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IValidator<CreatePropertyTimeLineLogDto> createPropertyTimeLineLogValidator, ICurrentUserService currentUserService)
        {
            _uow = uow;
            _mapper = mapper;
            _currentUserService = currentUserService;
            _queryRepositoryFactory = queryRepositoryFactory;
            _createPropertyTimeLineLogValidator = createPropertyTimeLineLogValidator;
        }

        public async Task<Response<PropertyTimeLineLogDto>> AddPropertyTimeLineLogAsync(int propertyId, PropertyStatus propertyStatus, string actionTaken)
        {
            var dto = new CreatePropertyTimeLineLogDto
            {
                PropertyId = propertyId,
                Status = propertyStatus,
                ActionTaken = actionTaken,
                ActionTakenBy = await _currentUserService.GetDisplayNameAsync()
            };
            var validation = await _createPropertyTimeLineLogValidator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                var errorMessage = validation.Errors.First().ErrorMessage;

                return new Response<PropertyTimeLineLogDto>
                {
                    Succeeded = false,
                    Message = errorMessage,
                    ValidationResultModel = new ValidationResultModel(validation)
                };
            }

            var propertQuery = _queryRepositoryFactory.QueryRepository<Domain.PropertyEntity.Property>();
            var property = await propertQuery.Queryable().FirstOrDefaultAsync(l => l.Id == dto.PropertyId);
            if (property == null)
                return new Response<PropertyTimeLineLogDto>($"No property found with the provided PropertyId: {dto.PropertyId}. Please enter a valid PropertyId.");

            var propertyTimeline = _mapper.Map<Domain.PropertyEntity.PropertyTimeLine>(dto);
            propertyTimeline.CreatedAt = DateTime.UtcNow;
            propertyTimeline.CreatedBy = dto.ActionTakenBy;

            await _uow.RepositoryAsync<Domain.PropertyEntity.PropertyTimeLine>().AddAsync(propertyTimeline);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var responseDto = _mapper.Map<PropertyTimeLineLogDto>(propertyTimeline);
            return new Response<PropertyTimeLineLogDto>(responseDto, "Property Logged successfully.");
        }

        public async Task<Response<List<PropertyTimeLineLogDto>>> GetPropertyTimeLineByID(int propertyID)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.PropertyEntity.PropertyTimeLine>();

            var timelines = await repo.Queryable()
                .Where(r => r.PropertyId == propertyID)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            if (timelines == null || timelines.Count == 0)
            {
                return new Response<List<PropertyTimeLineLogDto>>($"No timeline logs found for PropertyId: {propertyID}.");
            }

            var timelineDtos = _mapper.Map<List<PropertyTimeLineLogDto>>(timelines);
            return new Response<List<PropertyTimeLineLogDto>>(timelineDtos, "Property timeline logs retrieved successfully.");
        }
    }
}
