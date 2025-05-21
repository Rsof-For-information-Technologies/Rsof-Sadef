using Microsoft.AspNetCore.Identity;

namespace Sadef.Common.Infrastructure.EFCore.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
