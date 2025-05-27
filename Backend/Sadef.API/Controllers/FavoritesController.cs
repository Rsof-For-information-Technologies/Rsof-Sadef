using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Common.Infrastructure.Wrappers;
using System.Security.Claims;

namespace Sadef.API.Controllers.Public
{

    [Authorize]
    public class FavoritesController : ApiBaseController
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        private string GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User ID not found");

        [HttpPost("{propertyId}")]
        public async Task<IActionResult> AddFavorite(int propertyId)
        {
            var response = await _favoriteService.AddFavoriteAsync(GetUserId(), propertyId);
            return Ok(response);
        }

        [HttpDelete("{propertyId}")]
        public async Task<IActionResult> RemoveFavorite(int propertyId)
        {
            var response = await _favoriteService.RemoveFavoriteAsync(GetUserId(), propertyId);
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var response = await _favoriteService.GetUserFavoritesAsync(GetUserId());
            return Ok(response);
        }
    }
}
