namespace Sadef.Application.DTOs.UserDtos
{
    public record UserLoginResultDTO
    (
     string Token,
     string Id,
     string FirstName,
     string LastName,
     string Email,
     string Role,
     string RefreshToken
     );
}
