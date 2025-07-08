using Sadef.Application.DTOs.SeoMetaDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface ISeoMetaDataService
    {
        Task<Response<SeoMetaDataDto>> CreateSeoMetaAsync<T>(int entityId, CreateSeoMetaDetailsDto dto);
        Task<Response<SeoMetaDataDto>> GetByEntityAsync(int entityId, string entityType);
        Task<Response<bool>> DeleteByEntityAsync(int entityId, string entityType);
        Task<Response<SeoMetaDataDto>> UpdateSeoMetaAsync<T>(int entityId, CreateSeoMetaDetailsDto dto);
    }
} 
