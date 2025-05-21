using Sadef.Common.Infrastructure.EFCore.Identity;
using Microsoft.AspNetCore.Identity;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Common.Infrastructure.Wrappers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sadef.Application.Utils;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Net;
using Sadef.Application.Services.Email;
using Sadef.Application.DTOs.UserDtos;

namespace Sadef.Application.Services.User
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IValidator<RegisterUserWithEmailDto> _registerValidator;
        private readonly IValidator<LoginUserDto> _loginValidator;
        private readonly IValidator<ResetPasswordDto> _resetPasswordValidator;
        private readonly IValidator<ForgotPasswordDto> _forgotPasswordValidator;
        private readonly IValidator<UpdateUserDto> _updateUserValidator;
        private readonly IValidator<UpdateUserPasswordDto> _updateUserPasswordValidator;
        private readonly IValidator<RefreshTokenDto> _refreshTokendValidator;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailService _emailService;


        public UserManagementService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IValidator<RegisterUserWithEmailDto> registerValidator, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IValidator<LoginUserDto> loginValidator, IValidator<ResetPasswordDto> resetPasswordValidator, IValidator<ForgotPasswordDto> forgotPasswordValidator, IValidator<UpdateUserDto> updateUserValidator, IValidator<UpdateUserPasswordDto> updateUserPasswordValidator, IValidator<RefreshTokenDto> refreshTokendValidator)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _registerValidator = registerValidator;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _emailService = emailService;
            _loginValidator = loginValidator;
            _resetPasswordValidator = resetPasswordValidator;
            _forgotPasswordValidator = forgotPasswordValidator;
            _updateUserValidator = updateUserValidator;
            _updateUserPasswordValidator = updateUserPasswordValidator;
            _refreshTokendValidator = refreshTokendValidator;
        }

        public async Task<Response<bool>> CreateUserAsync(RegisterUserWithEmailDto request)
        {
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<bool>(errorMessage);
            }
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return new Response<bool>("Email is already in use.");
            }

            var user = new ApplicationUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                UserName = request.Email,
                Role = request.Role
            };

            if (!await _roleManager.RoleExistsAsync(request.Role))
            {
                return new Response<bool>($"Role '{request.Role}' does not exist.");
            }

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                return new Response<bool>($"Failed to register user: {errors}");
            }
            var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
            if (!roleResult.Succeeded)
            {
                var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                return new Response<bool>($"Failed to assign role: {errors}");
            }
            return new Response<bool>(true, "User registered successfully.");
        }

        public async Task<Response<UserLoginResultDTO>> LoginUserAsync(LoginUserDto request)
        {
            var validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<UserLoginResultDTO>(errorMessage);
            }
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return new Response<UserLoginResultDTO>("Invalid email or password.");
            }

            if (await _userManager.IsLockedOutAsync(user))
            {
                return new Response<UserLoginResultDTO>("User account is locked due to multiple failed login attempts.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = string.Join(", ", roles);

            var accessToken = TokenUtils.GenerateJwtToken(user, roles.ToList(), _configuration);
            var refreshToken = TokenUtils.GenerateRefreshToken();

            var refreshTokenExpiryDays = int.Parse(_configuration["Features:AuthN:RefreshTokenExpirationInDays"]);
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(refreshTokenExpiryDays).ToString();

            await _userManager.SetAuthenticationTokenAsync(user, "Default", "RefreshToken", refreshToken);
            await _userManager.SetAuthenticationTokenAsync(user, "Default", "RefreshTokenExpiry", refreshTokenExpiry);

            UserLoginResultDTO? resultDTO = null;
            resultDTO = new UserLoginResultDTO(accessToken, user.Id, user.FirstName, user.LastName, user.Email, role, refreshToken);

            return new Response<UserLoginResultDTO>(resultDTO, "Login successful.");

        }

        public async Task<Response<bool>> ForgotPasswordAsync(ForgotPasswordDto request)
        {
            var validationResult = await _forgotPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<bool>(errorMessage);
            }
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Response<bool>("User not found.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);

            var clientUrl = request.clientUrl;
            if (string.IsNullOrEmpty(clientUrl))
            {
                return new Response<bool>("Client URL is not configured.");
            }

            var resetUrl = $"{clientUrl}/?token={encodedToken}&email={user.Email}";
            var tokenExpirationMinutes = _configuration.GetValue<int>("SmtpSettings:TokenExpirationMinutes");

            string emailBody = $@"
                <p>Click the link below to reset your password:</p>
                <a href='{resetUrl}'>Reset Password</a>
                <br><br>
                <p><strong>Note:</strong> This link will expire in {tokenExpirationMinutes} minutes.</p>";

            bool emailSent = await _emailService.SendEmailAsync(user.Email, "Reset Password", emailBody);
            if (!emailSent)
            {
                return new Response<bool>("Failed to send recovery email.");
            }

            return new Response<bool>(true, "Recovery email sent successfully.");
        }

        public async Task<Response<bool>> ResetPasswordAsync(ResetPasswordDto request)
        {
            var validationResult = await _resetPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<bool>(errorMessage);
            }
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Response<bool>("User not found.");
            }

            var decodedToken = Uri.UnescapeDataString(request.ResetToken);
            var resetResult = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

            if (!resetResult.Succeeded)
            {
                var errors = string.Join(", ", resetResult.Errors.Select(e => e.Description));
                return new Response<bool>($"Failed to reset password: {errors}");
            }

            string emailBody = @"
                <p>Your password has been successfully reset.</p>
                <p>If you did not perform this action, please contact support immediately.</p>";

            bool emailSent = await _emailService.SendEmailAsync(user.Email, "Password Reset Confirmation", emailBody);
            if (!emailSent)
            {
                return new Response<bool>("Password reset was successful, but confirmation email failed to send.");
            }

            return new Response<bool>(true, "Password reset successfully. A confirmation email has been sent.");

        }

        public async Task<Response<List<UserResultDTO>>> GetUsersListAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            if (users == null || !users.Any())
            {
                return new Response<List<UserResultDTO>>("No users found.");
            }
            var userDtos = users.Select(u => new UserResultDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
            }).ToList();

            return new Response<List<UserResultDTO>>(userDtos);
        }

        public async Task<Response<bool>> UpdateUserAsync(UpdateUserDto request)
        {
            var validationResult = await _updateUserValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<bool>(errorMessage);
            }
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new Response<bool>("User not found.");
            }

            if (!string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null && existingUser.Id != request.UserId)
                {
                    return new Response<bool>("Email is already in use by another user.");
                }

                user.Email = request.Email;
                user.UserName = request.Email;
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return new Response<bool>("Failed to update user.");
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(request.Role))
            {
                if (!await _roleManager.RoleExistsAsync(request.Role))
                {
                    return new Response<bool>($"Role '{request.Role}' does not exist.");
                }

                if (currentRoles.Count > 0)
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                }

                var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
                if (!roleResult.Succeeded)
                {
                    return new Response<bool>("Failed to update role.");
                }
            }

            return new Response<bool>(true, "User updated successfully.");
        }
        public async Task<Response<UserResultDTO>> GetUserByIdAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return new Response<UserResultDTO>("User not found");

            return new Response<UserResultDTO>(new UserResultDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                IsActive = user.IsActive
            });
        }

        public async Task<Response<bool>> ToggleUserStatusAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return new Response<bool>("User not found.");

            user.IsActive = !user.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return new Response<bool>(result.Errors.First().Description);

            return new Response<bool>(true);
        }
        public async Task<Response<bool>> UpdatePasswordAsync(UpdateUserPasswordDto request)
        {
            var validationResult = await _updateUserPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<bool>(errorMessage);
            }
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new Response<bool>(false, "User not found.");
            }

            var loggedInUserId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var loggedInUserRoles = _httpContextAccessor.HttpContext?.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            if (loggedInUserId == null || loggedInUserRoles == null)
            {
                return new Response<bool>(false, "Unauthorized access.");
            }

            var isAuthorized = loggedInUserId == request.UserId || loggedInUserRoles.Contains("Admin") || loggedInUserRoles.Contains("SuperAdmin");

            if (!isAuthorized)
            {
                return new Response<bool>(false, "You are not authorized to update this user's password.");
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user, request.OldPassword);
            if (!passwordCheck)
            {
                return new Response<bool>(false, "Old password is incorrect.");
            }

            var passwordChangeResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            if (!passwordChangeResult.Succeeded)
            {
                var errors = string.Join(", ", passwordChangeResult.Errors.Select(e => e.Description));
                return new Response<bool>(false, $"Failed to change password: {errors}");
            }

            return new Response<bool>(true, "Password changed successfully.");
        }
        public async Task<Response<UserLoginResultDTO>> RefreshTokenAsync(RefreshTokenDto request)
        {
            var validationResult = await _refreshTokendValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                var errorMessage = validationResult.Errors.First().ErrorMessage;
                return new Response<UserLoginResultDTO>(errorMessage);
            }
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Response<UserLoginResultDTO>("Invalid email.");
            }

            var savedRefreshToken = await _userManager.GetAuthenticationTokenAsync(user, "Default", "RefreshToken");
            var refreshTokenExpiry = await _userManager.GetAuthenticationTokenAsync(user, "Default", "RefreshTokenExpiry");

            if (savedRefreshToken != request.RefreshToken)
            {
                return new Response<UserLoginResultDTO>("Invalid refresh token.");
            }

            if (DateTime.TryParse(refreshTokenExpiry, out DateTime expiryTime) && expiryTime < DateTime.UtcNow)
            {
                return new Response<UserLoginResultDTO>("Refresh token expired, please log in again.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = string.Join(", ", roles);

            var accessToken = TokenUtils.GenerateJwtToken(user, roles.ToList(), _configuration);
            var newRefreshToken = TokenUtils.GenerateRefreshToken();

            var refreshTokenExpiryDays = int.Parse(_configuration["Features:AuthN:RefreshTokenExpirationInDays"]);
            var newRefreshTokenExpiry = DateTime.UtcNow.AddDays(refreshTokenExpiryDays).ToString();

            await _userManager.RemoveAuthenticationTokenAsync(user, "Default", "RefreshToken");
            await _userManager.RemoveAuthenticationTokenAsync(user, "Default", "RefreshTokenExpiry");

            await _userManager.SetAuthenticationTokenAsync(user, "Default", "RefreshToken", newRefreshToken);
            await _userManager.SetAuthenticationTokenAsync(user, "Default", "RefreshTokenExpiry", newRefreshTokenExpiry);

            UserLoginResultDTO? resultDTO = null;
            resultDTO = new UserLoginResultDTO(accessToken, user.Id, user.FirstName, user.LastName, user.Email, role, newRefreshToken);

            return new Response<UserLoginResultDTO>(resultDTO, "Token refreshed successfully.");
        }

    }
}
