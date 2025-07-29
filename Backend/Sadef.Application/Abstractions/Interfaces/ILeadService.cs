using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface ILeadService
    {
        Task<Response<LeadDto>> CreateLeadAsync(CreateLeadDto dto);
        Task<Response<PaginatedResponse<LeadDto>>> GetPaginatedAsync(int pageNumber, int pageSize, LeadFilterDto filters, bool isExport);
        Task<Response<LeadDto>> GetByIdAsync(int id);
        Task<Response<LeadDto>> UpdateLeadAsync(UpdateLeadDto dto);
        Task<Response<LeadDashboardStatsDto>> GetLeadDashboardStatsAsync();
        Task<Response<LeadDto>> ChangeStatusAsync(UpdateLeadStatusDto status);
        Task<Response<List<LeadDto>>> GetLeadsCreatedByUserAsync(string email);


    }
}
