using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Application.DTOs.PropertyTimeLineDtos;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IPropertyTimeLineService
    {
        Task<Response<PropertyTimeLineLogDto>> AddPropertyTimeLineLogAsync(int propertyId, PropertyStatus propertyStatus, string actionTaken);
        Task<Response<List<PropertyTimeLineLogDto>>> GetPropertyTimeLineByID(int propertyID);
    }
}
