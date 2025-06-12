using FluentValidation;
using Sadef.Application.DTOs.LeadDtos;

namespace Sadef.Application.Services.Lead
{
    public class CreateLeadValidator : AbstractValidator<CreateLeadDto>
    {
        public CreateLeadValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required")
                .MaximumLength(100);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Phone)
                .MaximumLength(20).When(x => !string.IsNullOrWhiteSpace(x.Phone));

            RuleFor(x => x.Message)
                .MaximumLength(500);
        }
    }

    public class UpdateLeadValidator : AbstractValidator<UpdateLeadDto>
    {
        public UpdateLeadValidator()
        {
            RuleFor(x => x.FullName)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.FullName));

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage("Invalid email format")
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.Phone)
                .MaximumLength(20)
                .When(x => !string.IsNullOrWhiteSpace(x.Phone));

            RuleFor(x => x.Message)
                .MaximumLength(500)
                .When(x => !string.IsNullOrWhiteSpace(x.Message));

            RuleFor(x => x.Status)
                .InclusiveBetween(0, 1).WithMessage("Status must be 0 (False) or 1 (True)")
                .When(x => x.Status.HasValue);
        }
    }
}
