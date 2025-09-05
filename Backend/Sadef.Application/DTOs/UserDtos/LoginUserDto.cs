namespace Sadef.Application.DTOs.UserDtos
{
    public record LoginUserDto(string Email, string Password, string? FcmToken, string? DeviceType);
}
