using FluentValidation;
using Sadef.Application.DTOs.PropertyTimeLineDtos;

namespace Sadef.Application.Services.PropertyTimeLine
{
    public class CreatePropertyTimeLineValidator : AbstractValidator<CreatePropertyTimeLineLogDto>
    {
        public CreatePropertyTimeLineValidator()
        {
            RuleFor(x => x.PropertyId)
                .NotEmpty().WithMessage("PropertyId is required.");

            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Invalid lead status value.");

            RuleFor(x => x.ActionTaken)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

            RuleFor(x => x.ActionTakenBy)
                .NotEmpty().WithMessage("EventType is required.");
        }
    }
}
