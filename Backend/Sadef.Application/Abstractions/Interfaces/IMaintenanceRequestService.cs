using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IMaintenanceRequestService
    {
        Task<Response<PaginatedResponse<MaintenanceRequestDto>>> GetPaginatedAsync(int pageNumber, int pageSize, MaintenanceRequestFilterDto filters);
        Task<Response<MaintenanceRequestDto>> UpdateStatusAsync(UpdateMaintenanceRequestStatusDto dto);
        Task<Response<MaintenanceRequestDto>> UpdateAdminResponseAsync(UpdateAdminResponseDto dto);
        Task<Response<MaintenanceRequestDto>> CreateRequestAsync(CreateMaintenanceRequestDto dto);
        Task<Response<MaintenanceRequestDto>> UpdateMaintenanceRequestAsync(UpdateMaintenanceRequestDto dto);
        Task<Response<MaintenanceRequestDashboardStatsDto>> GetDashboardStatsAsync();
        Task<Response<MaintenanceRequestDto>> GetByIdAsync(int id);
        Task<Response<string>> DeleteMaintenanceRequestAsync(int id);
        Task<Response<List<MaintenanceRequestDto>>> GetMyMaintenanceRequestsAsync(string email);


    }
}
