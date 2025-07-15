using Sadef.Application.DTOs.ActivityLogDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IActivityLogService
    {
        Task<Response<ActivityLogDto>> LogAsync(ActivityLogCreateDto dto);
        Task<Response<PaginatedResponse<ActivityLogDto>>> GetLogsAsync(ActivityLogFilterDto filters, int pageNumber, int pageSize);
    }
}
