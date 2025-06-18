using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IMaintenanceRequestService
    {
        Task<Response<MaintenanceRequestDto>> CreateRequestAsync(CreateMaintenanceRequestDto dto);
        Task<Response<PaginatedResponse<MaintenanceRequestDto>>> GetPaginatedAsync(int pageNumber, int pageSize, MaintenanceRequestFilterDto filters);
        Task<Response<MaintenanceRequestDto>> GetByIdAsync(int id);

    }

}
