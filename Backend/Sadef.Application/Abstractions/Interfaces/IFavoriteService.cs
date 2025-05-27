using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IFavoriteService
    {
        Task<Response<string>> AddFavoriteAsync(string userId, int propertyId);
        Task<Response<string>> RemoveFavoriteAsync(string userId, int propertyId);
        Task<Response<List<PropertyDto>>> GetUserFavoritesAsync(string userId);
    }
}
