using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
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

        public LeadService(IUnitOfWorkAsync uow, IMapper mapper, IValidator<CreateLeadDto> createLeadValidator , IQueryRepositoryFactory queryRepositoryFactory, IValidator<UpdateLeadDto> updateLeadValidator)
        {
            _uow = uow;
            _mapper = mapper;
            _createLeadValidator = createLeadValidator;
            _queryRepositoryFactory = queryRepositoryFactory;
            _updateLeadValidator = updateLeadValidator;
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

            var responseDto = _mapper.Map<LeadDto>(lead);
            return new Response<LeadDto>(responseDto, "Inquiry submitted successfully.");
        }

        public async Task<Response<PaginatedResponse<LeadDto>>> GetPaginatedAsync(int pageNumber, int pageSize, LeadFilterDto filters)
        {
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

            // Pagination
            query = query.OrderByDescending(b => b.CreatedAt);
            var total = await query.CountAsync();
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            var dtoList = _mapper.Map<List<LeadDto>>(items);
            var paged = new PaginatedResponse<LeadDto>(dtoList, total, pageNumber, pageSize);
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

            if (dto.Status.HasValue && Enum.IsDefined(typeof(LeadStatus), dto.Status.Value))
                lead.Status = (LeadStatus)dto.Status.Value;

            lead.UpdatedAt = DateTime.UtcNow;

            await _uow.RepositoryAsync<Domain.LeadEntity.Lead>().UpdateAsync(lead);
            await _uow.SaveChangesAsync(CancellationToken.None);

            return new Response<LeadDto>(_mapper.Map<LeadDto>(lead), "Lead updated successfully.");
        }
    }
}
