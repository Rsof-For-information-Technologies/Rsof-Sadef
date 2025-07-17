using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.DTOs.AuditLogDtos;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IAuditLogService
    {
        Task<Response<PaginatedResponse<AuditLogDto>>> GetPaginatedAuditLogsAsync(int pageNumber, int pageSize, AuditLogFilterDto filters);
    }
}
