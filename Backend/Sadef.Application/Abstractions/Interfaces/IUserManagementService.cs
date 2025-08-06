using Sadef.Application.DTOs.UserDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IUserManagementService
    {
        Task<Response<bool>> CreateUserAsync(RegisterUserWithEmailDto request);
        Task<Response<UserLoginResultDTO>> LoginUserAsync(LoginUserDto dto);
        Task<Response<List<UserResultDTO>>> GetUsersListAsync();
        Task<Response<UserResultDTO>> GetUserByIdAsync(Guid id);
        Task<Response<UserResultDTO>> UpdateUserAsync(UpdateUserDto dto);
        Task<Response<bool>> UpdatePasswordAsync(UpdateUserPasswordDto dto);
        Task<Response<bool>> ToggleUserStatusAsync(Guid id);
        Task<Response<bool>> ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<Response<bool>> ResetPasswordAsync(ResetPasswordDto dto);
        Task<Response<UserLoginResultDTO>> RefreshTokenAsync(RefreshTokenDto dto);
        Task<Response<string>> VerifyEmailAsync(VerifyEmailRequestDto request);

    }
}
