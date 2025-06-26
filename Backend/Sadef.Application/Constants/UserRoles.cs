namespace Sadef.Application.Constants
{
    public static class UserRoles
    {
        public const string PublucUser = "PublicUser";
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Admin";
        
        public static readonly List<string> ValidRoles = new()
        {
            "PublicUser",
            "SuperAdmin",
            "Admin"
        };
    }
}
