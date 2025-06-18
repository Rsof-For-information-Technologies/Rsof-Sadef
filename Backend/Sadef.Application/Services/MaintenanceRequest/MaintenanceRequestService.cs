using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;

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
            request.Status = MaintenanceRequestStatus.Pending;
            request.CreatedAt = DateTime.UtcNow;
            request.CreatedBy = "system";

            await _uow.RepositoryAsync<Domain.MaintenanceRequestEntity.MaintenanceRequest>().AddAsync(request);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var responseDto = _mapper.Map<MaintenanceRequestDto>(request);
            return new Response<MaintenanceRequestDto>(responseDto, "Maintenance request submitted successfully.");
        }
    }
}
