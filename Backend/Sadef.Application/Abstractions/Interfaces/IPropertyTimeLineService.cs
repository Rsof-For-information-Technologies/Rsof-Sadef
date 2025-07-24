using Sadef.Application.DTOs.OrderTimeLineDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IPropertyTimeLineService
    {
        Task<Response<PropertyTimeLineLogDto>> AddPropertyTimeLineLogAsync(CreatePropertyTimeLineLogDto dto);
    }
}
