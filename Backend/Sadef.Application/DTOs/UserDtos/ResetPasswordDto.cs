namespace Sadef.Application.DTOs.UserDtos
{
    public record ResetPasswordDto(string Email,
      string ResetToken,
      string NewPassword,
      string ConfirmNewPassword);
}
