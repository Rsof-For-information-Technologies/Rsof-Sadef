using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.AuditLogDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Services.AuditLog
{
    public class AuditLogService : IAuditLogService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IMapper _mapper;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;
        private readonly IDistributedCache _cache;

        public AuditLogService(IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IDistributedCache cache)
        {
            _uow = uow;
            _cache = cache;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
        }

        public async Task<Response<PaginatedResponse<AuditLogDto>>> GetPaginatedAuditLogsAsync(int pageNumber, int pageSize, AuditLogFilterDto filters)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Common.Domain.AuditLog>();
            var query = AuditLogHelper.ApplyFilters(repo.Queryable(), filters);
            var totalCount = await query.CountAsync();

            var paginatedItems = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var dtoList = _mapper.Map<List<AuditLogDto>>(paginatedItems);

            var paginatedResponse = new PaginatedResponse<AuditLogDto>(
                dtoList,
                totalCount,
                pageNumber,
                pageSize
            );

            return new Response<PaginatedResponse<AuditLogDto>>(
                paginatedResponse,
                "Audit Logs retrieved successfully."
            );
        }
    }
}
