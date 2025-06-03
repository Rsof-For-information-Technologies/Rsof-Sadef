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
}
