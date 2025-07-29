using FluentValidation;
using Sadef.Application.Constants;
using Sadef.Application.DTOs.UserDtos;
using Microsoft.Extensions.Localization;
namespace Sadef.Application.Services.User
{
    public class UserRegisterValidator : AbstractValidator<RegisterUserWithEmailDto>
    {
        public UserRegisterValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.FirstName)
               .NotEmpty().WithMessage(localizer["User_FirstNameRequired"])
               .Matches(@"^[A-Za-z\s]+$").WithMessage(localizer["User_FirstNameLetters"])
               .MaximumLength(50).WithMessage(localizer["User_FirstNameMaxLength", 50]);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage(localizer["User_LastNameRequired"])
                .Matches(@"^[A-Za-z\s]+$").WithMessage(localizer["User_LastNameLetters"])
                .MaximumLength(50).WithMessage(localizer["User_LastNameMaxLength", 50]);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["User_EmailRequired"])
                .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
                .WithMessage(localizer["User_EmailInvalid"]);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage(localizer["User_PasswordRequired"])
                .MinimumLength(6).WithMessage(localizer["User_PasswordMinLength", 6]);

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage(localizer["User_ConfirmPasswordMatch"]);

            RuleFor(x => x.Role)
               .NotEmpty().WithMessage(localizer["User_RoleRequired"])
                .Must(role => UserRoles.ValidRoles.Contains(role))
                .WithMessage(localizer["User_RoleInvalid"]);
        }
    }
    public class UserLoginValidator : AbstractValidator<LoginUserDto>
    {
        public UserLoginValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email)
               .NotEmpty().WithMessage(localizer["User_EmailRequired"])
               .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
               .WithMessage(localizer["User_EmailInvalid"]);

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage(localizer["User_PasswordRequired"])
                .MinimumLength(6).WithMessage(localizer["User_PasswordMinLength", 6]);
        }
    }
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordDto>
    {
        public ResetPasswordValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["User_EmailRequired"])
                .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
                .WithMessage(localizer["User_EmailInvalid"]);

            RuleFor(x => x.ResetToken)
                .NotEmpty().WithMessage(localizer["User_TokenRequired"]);

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage(localizer["User_PasswordRequired"])
                .MinimumLength(6).WithMessage(localizer["User_PasswordMinLength", 6]);

            RuleFor(x => x.ConfirmNewPassword)
                .Equal(x => x.NewPassword).WithMessage(localizer["User_ConfirmPasswordMatch"]);
        }
    }
    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordDto>
    {
        public ForgotPasswordValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["User_EmailRequired"])
                .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
                .WithMessage(localizer["User_EmailInvalid"]);
        }
    }
    public class UpdateUserValidator : AbstractValidator<UpdateUserDto>
    {
        public UpdateUserValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage(localizer["User_UserIdRequired"]);

            RuleFor(x => x.FirstName)
               .NotEmpty().WithMessage(localizer["User_FirstNameRequired"])
               .Matches(@"^[A-Za-z\s]+$").WithMessage(localizer["User_FirstNameLetters"])
               .MaximumLength(50).WithMessage(localizer["User_FirstNameMaxLength", 50]);

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage(localizer["User_LastNameRequired"])
                .Matches(@"^[A-Za-z\s]+$").WithMessage(localizer["User_LastNameLetters"])
                .MaximumLength(50).WithMessage(localizer["User_LastNameMaxLength", 50]);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["User_EmailRequired"])
                .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
                .WithMessage(localizer["User_EmailInvalid"]);

            RuleFor(x => x.Role)
               .NotEmpty().WithMessage(localizer["User_RoleRequired"])
                .Must(role => UserRoles.ValidRoles.Contains(role))
                .WithMessage(localizer["User_RoleInvalid"]);
        }
    }
    public class UpdateUserPasswordValidator : AbstractValidator<UpdateUserPasswordDto>
    {
        public UpdateUserPasswordValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage(localizer["User_UserIdRequired"]);
            RuleFor(x => x.OldPassword)
                .NotEmpty()
                .WithMessage(localizer["User_OldPasswordRequired"]);
            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .WithMessage(localizer["User_NewPasswordRequired"])
                .MinimumLength(6)
                .WithMessage(localizer["User_NewPasswordMinLength", 6]);
            RuleFor(x => x.ConfirmNewPassword)
                .NotEmpty()
                .WithMessage(localizer["User_ConfirmNewPasswordRequired"])
                .Equal(x => x.NewPassword)
                .WithMessage(localizer["User_ConfirmNewPasswordMatch"]);
        }
    }
    public class RefreshTokenValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["User_EmailRequired"])
                .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
                .WithMessage(localizer["User_EmailInvalid"]);

            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage(localizer["User_RefreshTokenRequired"]);
        }
    }
}