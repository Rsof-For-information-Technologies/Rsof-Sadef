using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IMaintenanceRequestService
    {
        Task<Response<MaintenanceRequestDto>> CreateRequestAsync(CreateMaintenanceRequestDto dto);
    }

}
