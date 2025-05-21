namespace Sadef.Application.DTOs.UserDtos
{
    public record RegisterUserWithEmailDto(
        string FirstName,
        string LastName,
        string Email,
        string Password,
        string ConfirmPassword,
        string Role
    );

}
