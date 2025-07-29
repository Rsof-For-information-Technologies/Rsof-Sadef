using Sadef.Application.DTOs.ContactDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IContactService
    {
        Task<Response<ContactDto>> CreateContactAsync(CreateContactDto dto);
        Task<Response<PaginatedResponse<ContactDto>>> GetPaginatedAsync(int pageNumber, int pageSize, ContactFilterDto filters, bool isExport);
        Task<Response<ContactDto>> GetByIdAsync(int id);
        Task<Response<ContactDto>> UpdateContactAsync(UpdateContactDto dto);
        Task<Response<ContactDto>> ChangeStatusAsync(UpdateContactStatusDto dto);
        Task<Response<ContactDashboardStatsDto>> GetContactDashboardStatsAsync();
        Task<Response<List<ContactDto>>> GetContactsByPropertyAsync(int propertyId);
        Task<Response<string>> DeleteContactAsync(int id);
    }
} 