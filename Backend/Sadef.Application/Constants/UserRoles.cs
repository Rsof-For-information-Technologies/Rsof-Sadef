namespace Sadef.Application.Constants
{
    public static class UserRoles
    {
        public const string Visitor = "Visitor";
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Admin";
        public const string Investor = "Investor";
        
        public static readonly List<string> ValidRoles = new()
        {
            "Visitor",
            "SuperAdmin",
            "Admin",
            "Investor"
        };
    }
}
