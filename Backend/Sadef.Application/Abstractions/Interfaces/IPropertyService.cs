using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Domain.Constants;
namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IPropertyService
    {
        Task<Response<PropertyDto>> CreatePropertyAsync(CreatePropertyDto dto);
        Task<Response<PaginatedResponse<PropertyDto>>> GetAllPropertiesAsync(PaginationRequest request);
        Task<Response<PropertyDto>> GetPropertyByIdAsync(int id);
        Task<Response<string>> DeletePropertyAsync(int id);
        Task<Response<PropertyDto>> UpdatePropertyAsync(UpdatePropertyDto dto);
        Task<Response<PropertyDto>> ChangeStatusAsync(PropertyStatusUpdateDto status);
        Task<Response<PaginatedResponse<PropertyDto>>> GetFilteredPropertiesAsync(PropertyFilterRequest request);
        Task<Response<PropertyDto>> UpdateExpiryAsync(PropertyExpiryUpdateDto dto);
        Task<Response<PropertyDashboardStatsDto>> GetPropertyDashboardStatsAsync();
    }
}
