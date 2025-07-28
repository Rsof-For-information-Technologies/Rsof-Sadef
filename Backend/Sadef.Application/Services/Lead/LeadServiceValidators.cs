using FluentValidation;
using Sadef.Application.DTOs.LeadDtos;
using Microsoft.Extensions.Localization;

namespace Sadef.Application.Services.Lead
{
    public class CreateLeadValidator : AbstractValidator<CreateLeadDto>
    {
        public CreateLeadValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage(localizer["Lead_FullNameRequired"])
                .MaximumLength(100).WithMessage(localizer["Lead_FullNameMaxLength", 100]);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["Lead_EmailRequired"])
                .EmailAddress().WithMessage(localizer["Lead_EmailInvalid"]);

            RuleFor(x => x.Phone)
                .MaximumLength(20).When(x => !string.IsNullOrWhiteSpace(x.Phone)).WithMessage(localizer["Lead_PhoneMaxLength", 20]);

            RuleFor(x => x.Message)
                .MaximumLength(500).WithMessage(localizer["Lead_MessageMaxLength", 500]);
        }
    }

    public class UpdateLeadValidator : AbstractValidator<UpdateLeadDto>
    {
        public UpdateLeadValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.FullName)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.FullName)).WithMessage(localizer["Lead_FullNameMaxLength", 100]);

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage(localizer["Lead_EmailInvalid"])
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.Phone)
                .MaximumLength(20)
                .When(x => !string.IsNullOrWhiteSpace(x.Phone)).WithMessage(localizer["Lead_PhoneMaxLength", 20]);

            RuleFor(x => x.Message)
                .MaximumLength(500)
                .When(x => !string.IsNullOrWhiteSpace(x.Message)).WithMessage(localizer["Lead_MessageMaxLength", 500]);

            RuleFor(x => x.Status)
                .IsInEnum()
                .When(x => x.Status.HasValue)
                .WithMessage(localizer["Lead_StatusInvalid"]);
        }
    }
}
