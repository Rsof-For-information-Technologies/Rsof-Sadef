namespace Sadef.Common.Services.CurrentUser
{
    public interface ICurrentUserService
    {
        Task<string> GetDisplayNameAsync();
        string Role { get; }
    }
}
