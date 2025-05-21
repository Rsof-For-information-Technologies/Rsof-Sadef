namespace Sadef.Application.DTOs.UserDtos
{
    public record UpdateUserPasswordDto
    (
      string UserId,
      string OldPassword,
      string NewPassword,
      string ConfirmNewPassword);
}
