using Sadef.Common.Domain;

namespace Sadef.Domain
{
    public class User : AggregateRootBase
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
