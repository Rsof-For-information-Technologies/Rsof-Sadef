using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.ActivityLogDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Services.ActivityLog
{
    public class ActivityLogService: IActivityLogService
    {
        private readonly IValidator<ActivityLogCreateDto> _createActivityLogValidator;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IDistributedCache _cache;
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;

        public ActivityLogService(IQueryRepositoryFactory queryRepositoryFactory, IDistributedCache cache, IUnitOfWorkAsync uow, IMapper mapper, IValidator<ActivityLogCreateDto> createActivityLogValidator)
        {
            _queryRepositoryFactory = queryRepositoryFactory;
            _createActivityLogValidator = createActivityLogValidator;
            _mapper = mapper;
            _cache = cache;
            _uow = uow;
        }

        public async Task<Response<ActivityLogDto>> LogAsync(ActivityLogCreateDto dto)
        {
            var validationResult = await _createActivityLogValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<ActivityLogDto>(errorMessage);
            }

            var activityLog = _mapper.Map<Domain.ActivityLogEntity.ActivityLog>(dto);
            var repository = _uow.RepositoryAsync<Domain.ActivityLogEntity.ActivityLog>();
            await repository.AddAsync(activityLog);
            await _uow.SaveChangesAsync(CancellationToken.None);

            var activityLogDto = _mapper.Map<ActivityLogDto>(activityLog);
            return new Response<ActivityLogDto>(activityLogDto, "Log Generated Succesfully");
        }

        public async Task<Response<PaginatedResponse<ActivityLogDto>>> GetLogsAsync(ActivityLogFilterDto filters, int pageNumber, int pageSize)
        {

            var repo = _queryRepositoryFactory.QueryRepository<Domain.ActivityLogEntity.ActivityLog>();
            var query = ActivityLogHelper.ApplyFilters(repo.Queryable(), filters);

            var totalCount = await query.CountAsync();

            var paginatedItems = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtoList = _mapper.Map<List<ActivityLogDto>>(paginatedItems);

            var paginatedResponse = new PaginatedResponse<ActivityLogDto>(
                dtoList,
                totalCount,
                pageNumber,
                pageSize
            );

            return new Response<PaginatedResponse<ActivityLogDto>>(
                paginatedResponse,
                "Logs requests retrieved successfully."
            );
        }
    }
}
