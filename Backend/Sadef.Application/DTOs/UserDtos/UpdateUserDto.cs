namespace Sadef.Application.DTOs.UserDtos
{
    public record UpdateUserDto(string UserId,
        string FirstName,
        string LastName,
        string Email,
        string Role);
}
