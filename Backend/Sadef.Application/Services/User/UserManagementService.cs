using Sadef.Common.Infrastructure.EFCore.Identity;
using Microsoft.AspNetCore.Identity;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Common.Infrastructure.Wrappers;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sadef.Common.Infrastructure.Validator;
using FluentValidation.Results;
using Sadef.Application.Utils;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Net;
using Sadef.Application.Services.Email;
using Sadef.Application.DTOs.UserDtos;
using Microsoft.Extensions.Localization;

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
        private readonly IStringLocalizer _localizer;

        public UserManagementService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IValidator<RegisterUserWithEmailDto> registerValidator, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IValidator<LoginUserDto> loginValidator, IValidator<ResetPasswordDto> resetPasswordValidator, IValidator<ForgotPasswordDto> forgotPasswordValidator, IValidator<UpdateUserDto> updateUserValidator, IValidator<UpdateUserPasswordDto> updateUserPasswordValidator, IValidator<RefreshTokenDto> refreshTokendValidator, IStringLocalizerFactory localizerFactory)
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
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
        }

        public async Task<Response<bool>> CreateUserAsync(RegisterUserWithEmailDto request)
        {
            var validationResult = await _registerValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new Response<bool>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var user = new ApplicationUser
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                UserName = request.Email,
                Email = request.Email,
                IsActive = true,
                Role = request.Role
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var localizedErrors = result.Errors.Select(e => GetLocalizedIdentityError(e.Code, e.Description)).ToList();
                var validation = new ValidationResult(localizedErrors.Select(msg => new ValidationFailure("", msg)));
                return new Response<bool>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validation)
                };
            }

            await _userManager.AddToRoleAsync(user, request.Role);

            if (string.Equals(request.Role, "Admin", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(request.Role, "SuperAdmin", StringComparison.OrdinalIgnoreCase))
            {
                var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmResult = await _userManager.ConfirmEmailAsync(user, emailToken);

                if (!confirmResult.Succeeded)
                {
                    return new Response<bool> { Succeeded = false, Message = _localizer["User_FailedAutoVerifyAdminEmail"] };
                }

                return new Response<bool> { Succeeded = true, Message = _localizer["User_Registered"] };
            }
            // Generate and send email verification link
            await SendEmailVerificationAsync(user);
            return new Response<bool>(true , _localizer["User_RegisteredAndVerificationSent"]);
        }

        private string GetLocalizedIdentityError(string errorCode, string description)
        {
            return errorCode switch
            {
                "PasswordRequiresNonAlphanumeric" => _localizer["Identity_PasswordRequiresNonAlphanumeric"],
                "PasswordRequiresDigit" => _localizer["Identity_PasswordRequiresDigit"],
                "PasswordRequiresLower" => _localizer["Identity_PasswordRequiresLower"],
                "PasswordRequiresUpper" => _localizer["Identity_PasswordRequiresUpper"],
                "PasswordTooShort" => _localizer["Identity_PasswordTooShort"],
                "DuplicateUserName" => ExtractValueFromDescription(description, "Username '", "' is already taken.", "Identity_DuplicateUserName"),
                "DuplicateEmail" => ExtractValueFromDescription(description, "Email '", "' is already taken.", "Identity_DuplicateEmail"),
                "InvalidUserName" => ExtractValueFromDescription(description, "User name '", "' is invalid, can only contain letters or digits.", "Identity_InvalidUserName"),
                "InvalidEmail" => ExtractValueFromDescription(description, "Email '", "' is invalid.", "Identity_InvalidEmail"),
                _ => _localizer["Identity_UnknownError"]
            };
        }

        private string ExtractValueFromDescription(string description, string prefix, string suffix, string localizedKey)
        {
            if (description.StartsWith(prefix) && description.EndsWith(suffix))
            {
                var value = description.Substring(prefix.Length, description.Length - prefix.Length - suffix.Length);
                return _localizer[localizedKey, value];
            }
            return description; // Fallback to original description if parsing fails
        }

        private async Task SendEmailVerificationAsync(ApplicationUser user)
        {
            if (string.IsNullOrEmpty(user?.Email))
            {
                throw new ArgumentNullException(nameof(user.Email), "User email cannot be null or empty.");
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);
            var baseUrl = _configuration["App:BaseUrl"];
            var verificationUrl = $"{baseUrl}/api/user/verify-email?userId={user.Id}&token={encodedToken}";

            // Get current culture from HTTP context
            var culture = _httpContextAccessor.HttpContext?.Request.Headers["Accept-Language"].FirstOrDefault() ?? "en";
            var language = culture.StartsWith("ar") ? "ar" : "en";

            // Use localized email service
            await _emailService.SendEmailAsync(user.Email, "EmailVerification", verificationUrl, language);
        }

        public async Task<Response<string>> VerifyEmailAsync(VerifyEmailRequestDto request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
                return new Response<string> { Succeeded = false, Message = _localizer["User_NotFound"] };
            var decodedToken = Uri.UnescapeDataString(request.Token);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (result.Succeeded)
                return new Response<string>{ Succeeded = false, Message = _localizer["User_EmailVerified"] };

            return new Response<string>{ Succeeded = false, Message = _localizer["User_EmailVerificationFailed"] };
        }

        public async Task<Response<UserLoginResultDTO>> LoginUserAsync(LoginUserDto request)
        {
            var validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new Response<UserLoginResultDTO>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }
            var user = await _userManager.FindByEmailAsync(request.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            {
                return new Response<UserLoginResultDTO>{ Succeeded = false, Message = _localizer["User_InvalidEmailOrPassword"] };
            }
            if (!user.EmailConfirmed)
            {
                return new Response<UserLoginResultDTO>{ Succeeded = false, Message = _localizer["User_EmailNotVerified"] };
            }
            if (await _userManager.IsLockedOutAsync(user))
            {
                return new Response<UserLoginResultDTO>{ Succeeded = false, Message = _localizer["User_AccountLocked"] };
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

            return new Response<UserLoginResultDTO>(resultDTO, _localizer["User_LoginSuccessful"]);

        }

        public async Task<Response<bool>> ForgotPasswordAsync(ForgotPasswordDto request)
        {
            var validationResult = await _forgotPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new Response<bool>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Response<bool>{ Succeeded = false, Message = _localizer["User_NotFound"] };
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebUtility.UrlEncode(token);

            var clientUrl = request.clientUrl;
            if (string.IsNullOrEmpty(clientUrl))
            {
                return new Response<bool>{ Succeeded = false, Message = _localizer["User_ClientUrlNotConfigured"] };
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
                return new Response<bool>{ Succeeded = false, Message = _localizer["User_FailedToSendRecoveryEmail"] };
            }

            return new Response<bool>(true, _localizer["User_RecoveryEmailSent"]);
        }

        public async Task<Response<bool>> ResetPasswordAsync(ResetPasswordDto request)
        {
            var validationResult = await _resetPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new Response<bool>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Response<bool>{ Succeeded = false, Message = _localizer["User_NotFound"] };
            }

            var decodedToken = Uri.UnescapeDataString(request.ResetToken);
            var resetResult = await _userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

            if (!resetResult.Succeeded)
            {
                var errors = string.Join(", ", resetResult.Errors.Select(e => e.Description));
                return new Response<bool>(string.Format(_localizer["User_FailedToResetPassword"], errors));
            }

            string emailBody = @"
                <p>Your password has been successfully reset.</p>
                <p>If you did not perform this action, please contact support immediately.</p>";

            bool emailSent = await _emailService.SendEmailAsync(user.Email, "Password Reset Confirmation", emailBody);
            if (!emailSent)
            {
                return new Response<bool>{ Succeeded = false, Message = _localizer["User_PasswordResetButEmailFailed"] };
            }

            return new Response<bool>(true, _localizer["User_PasswordResetAndEmailSent"]);

        }

        public async Task<Response<List<UserResultDTO>>> GetUsersListAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            if (users == null || !users.Any())
            {
                return new Response<List<UserResultDTO>>{ Succeeded = false, Message = _localizer["User_NoUsersFound"] };
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
        public async Task<Response<UserResultDTO>> UpdateUserAsync(UpdateUserDto request)
        {
            var validationResult = await _updateUserValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new Response<UserResultDTO>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }

            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new Response<UserResultDTO>{ Succeeded = false, Message = _localizer["User_NotFound"] };
            }

            if (!string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase))
            {
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null && existingUser.Id != request.UserId)
                {
                    return new Response<UserResultDTO>{ Succeeded = false, Message = _localizer["User_EmailAlreadyInUse"] };
                }

                user.Email = request.Email;
                user.UserName = request.Email;
            }

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.Role = request.Role;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return new Response<UserResultDTO>{ Succeeded = false, Message = _localizer["User_FailedToUpdate"] };
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(request.Role))
            {
                if (!await _roleManager.RoleExistsAsync(request.Role))
                {
                    return new Response<UserResultDTO>(string.Format(_localizer["User_RoleDoesNotExist"], request.Role));
                }

                if (currentRoles.Count > 0)
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                }

                var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
                if (!roleResult.Succeeded)
                {
                    return new Response<UserResultDTO>{ Succeeded = false, Message = _localizer["User_FailedToUpdateRole"] };
                }
            }

            var updatedUserDto = new UserResultDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                IsActive = user.IsActive
            };

            return new Response<UserResultDTO>(updatedUserDto, _localizer["User_FailedToUpdateRole"]);
        }

        public async Task<Response<UserResultDTO>> GetUserByIdAsync(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return new Response<UserResultDTO>{ Succeeded = false, Message = _localizer["User_NotFound"] };

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
                return new Response<bool>{ Succeeded = false, Message = _localizer["User_NotFound"] };

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
                return new Response<bool>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new Response<bool> { Succeeded = false, Message = _localizer["User_NotFound"] };
            }

            var loggedInUserId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var loggedInUserRoles = _httpContextAccessor.HttpContext?.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            if (loggedInUserId == null || loggedInUserRoles == null)
            {
                return new Response<bool> { Succeeded = false, Message = _localizer["User_UnauthorizedAccess"] };
            }

            var isAuthorized = loggedInUserId == request.UserId || loggedInUserRoles.Contains("Admin") || loggedInUserRoles.Contains("SuperAdmin");

            if (!isAuthorized)
            {
                return new Response<bool> { Succeeded = false, Message = _localizer["User_NotAuthorizedToUpdatePassword"] };
            }

            var passwordCheck = await _userManager.CheckPasswordAsync(user, request.OldPassword);
            if (!passwordCheck)
            {
                return new Response<bool> { Succeeded = false, Message = _localizer["User_OldPasswordIncorrect"] };
            }

            var passwordChangeResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            if (!passwordChangeResult.Succeeded)
            {
                var errors = string.Join(", ", passwordChangeResult.Errors.Select(e => e.Description));
                return new Response<bool>(false, string.Format(_localizer["User_FailedToChangePassword"], errors));
            }

            return new Response<bool>(true, _localizer["User_PasswordChanged"]);
        }
        public async Task<Response<UserLoginResultDTO>> RefreshTokenAsync(RefreshTokenDto request)
        {
            var validationResult = await _refreshTokendValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return new Response<UserLoginResultDTO>
                {
                    Succeeded = false,
                    Message = "Validation Failed",
                    ValidationResultModel = new ValidationResultModel(validationResult)
                };
            }
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new Response<UserLoginResultDTO>{ Succeeded = false, Message = _localizer["User_InvalidEmail"] };
            }

            var savedRefreshToken = await _userManager.GetAuthenticationTokenAsync(user, "Default", "RefreshToken");
            var refreshTokenExpiry = await _userManager.GetAuthenticationTokenAsync(user, "Default", "RefreshTokenExpiry");

            if (savedRefreshToken != request.RefreshToken)
            {
                return new Response<UserLoginResultDTO>{ Succeeded = false, Message = _localizer["User_InvalidRefreshToken"] };
            }

            if (DateTime.TryParse(refreshTokenExpiry, out DateTime expiryTime) && expiryTime < DateTime.UtcNow)
            {
                return new Response<UserLoginResultDTO>{ Succeeded = false, Message = _localizer["User_RefreshTokenExpired"] };
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

            return new Response<UserLoginResultDTO>(resultDTO, _localizer["User_TokenRefreshed"]);
        }

    }
}
