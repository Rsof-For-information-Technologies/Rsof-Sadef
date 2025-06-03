using Sadef.Application.DTOs.LeadDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface ILeadService
    {
        Task<Response<LeadDto>> CreateLeadAsync(CreateLeadDto dto);
    }
}
