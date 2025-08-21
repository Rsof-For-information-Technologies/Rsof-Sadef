using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Sadef.Common.Infrastructure.EFCore.Identity;
using System.Security.Claims;

namespace Sadef.Common.Services.CurrentUser
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<string> GetDisplayNameAsync()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userEmail = user?.FindFirst(ClaimTypes.Name)?.Value ?? "";
            var appUser = await _userManager.FindByEmailAsync(userEmail);
            return appUser != null ? $"{appUser.FirstName} {appUser.LastName}" : userEmail;
        }


        public string Role =>
            _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value ?? "";

    }
}