using FluentValidation;
using Sadef.Application.DTOs.ContactDtos;
using Microsoft.Extensions.Localization;

namespace Sadef.Application.Services.Contact
{
    public class CreateContactValidator : AbstractValidator<CreateContactDto>
    {
        public CreateContactValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage(localizer["Contact_FullNameRequired"])
                .MaximumLength(100).WithMessage(localizer["Contact_FullNameMaxLength", 100]);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["Contact_EmailRequired"])
                .EmailAddress().WithMessage(localizer["Contact_EmailInvalid"]);

            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage(localizer["Contact_SubjectRequired"])
                .MaximumLength(200).WithMessage(localizer["Contact_SubjectMaxLength", 200]);

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage(localizer["Contact_MessageRequired"])
                .MaximumLength(2000).WithMessage(localizer["Contact_MessageMaxLength", 2000]);

            RuleFor(x => x.Phone)
                .MaximumLength(20).When(x => !string.IsNullOrWhiteSpace(x.Phone))
                .WithMessage(localizer["Contact_PhoneMaxLength", 20]);

            RuleFor(x => x.PreferredContactMethod)
                .MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.PreferredContactMethod))
                .WithMessage(localizer["Contact_PreferredContactMethodMaxLength", 50]);

            RuleFor(x => x.Budget)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.Budget))
                .WithMessage(localizer["Contact_BudgetMaxLength", 100]);

            RuleFor(x => x.PropertyType)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.PropertyType))
                .WithMessage(localizer["Contact_PropertyTypeMaxLength", 100]);

            RuleFor(x => x.Location)
                .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.Location))
                .WithMessage(localizer["Contact_LocationMaxLength", 200]);

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage(localizer["Contact_TypeInvalid"]);
        }
    }

    public class UpdateContactValidator : AbstractValidator<UpdateContactDto>
    {
        public UpdateContactValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Contact_IdRequired"]);

            RuleFor(x => x.FullName)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.FullName))
                .WithMessage(localizer["Contact_FullNameMaxLength", 100]);

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage(localizer["Contact_EmailInvalid"])
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.Subject)
                .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.Subject))
                .WithMessage(localizer["Contact_SubjectMaxLength", 200]);

            RuleFor(x => x.Message)
                .MaximumLength(2000).When(x => !string.IsNullOrWhiteSpace(x.Message))
                .WithMessage(localizer["Contact_MessageMaxLength", 2000]);

            RuleFor(x => x.Phone)
                .MaximumLength(20).When(x => !string.IsNullOrWhiteSpace(x.Phone))
                .WithMessage(localizer["Contact_PhoneMaxLength", 20]);

            RuleFor(x => x.PreferredContactMethod)
                .MaximumLength(50).When(x => !string.IsNullOrWhiteSpace(x.PreferredContactMethod))
                .WithMessage(localizer["Contact_PreferredContactMethodMaxLength", 50]);

            RuleFor(x => x.Budget)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.Budget))
                .WithMessage(localizer["Contact_BudgetMaxLength", 100]);

            RuleFor(x => x.PropertyType)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.PropertyType))
                .WithMessage(localizer["Contact_PropertyTypeMaxLength", 100]);

            RuleFor(x => x.Location)
                .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.Location))
                .WithMessage(localizer["Contact_LocationMaxLength", 200]);

            RuleFor(x => x.Type)
                .IsInEnum().When(x => x.Type.HasValue)
                .WithMessage(localizer["Contact_TypeInvalid"]);

            RuleFor(x => x.Status)
                .IsInEnum().When(x => x.Status.HasValue)
                .WithMessage(localizer["Contact_StatusInvalid"]);
        }
    }

    public class UpdateContactStatusValidator : AbstractValidator<UpdateContactStatusDto>
    {
        public UpdateContactStatusValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Contact_IdRequired"]);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage(localizer["Contact_StatusInvalid"]);
        }
    }
}