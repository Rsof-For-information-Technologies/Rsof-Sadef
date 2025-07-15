using FluentValidation;
using Sadef.Application.DTOs.ActivityLogDtos;

namespace Sadef.Application.Services.ActivityLog
{
    public class ActivityLogCreateValidator : AbstractValidator<ActivityLogCreateDto>
    {
        public ActivityLogCreateValidator()
        {
            RuleFor(x => x.UserId)
                .NotEmpty().WithMessage("UserId is required")
                .MaximumLength(100);

            RuleFor(x => x.UserEmail)
                .NotEmpty().WithMessage("UserEmail is required")
                .MaximumLength(100);

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Role is required")
                .MaximumLength(50);

            RuleFor(x => x.Action)
                .NotEmpty().WithMessage("Action is required")
                .MaximumLength(100);

            RuleFor(x => x.EntityType)
                .NotEmpty().WithMessage("EntityType is required")
                .MaximumLength(100);

            RuleFor(x => x.EntityId)
                .GreaterThan(0)
                .When(x => x.EntityId.HasValue);

            RuleFor(x => x.IPAddress)
                .MaximumLength(50)
                .When(x => !string.IsNullOrWhiteSpace(x.IPAddress));

            RuleFor(x => x.ErrorMessage)
                .MaximumLength(1000)
                .When(x => !string.IsNullOrWhiteSpace(x.ErrorMessage));
        }
    }

    public class ActivityLogFilterValidator : AbstractValidator<ActivityLogFilterDto>
    {
        public ActivityLogFilterValidator()
        {
            RuleFor(x => x.UserId)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.UserId));

            RuleFor(x => x.UserEmail)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.UserEmail));

            RuleFor(x => x.Category)
                .MaximumLength(50)
                .When(x => !string.IsNullOrWhiteSpace(x.Category));

            RuleFor(x => x.Action)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.Action));

            RuleFor(x => x.EntityType)
                .MaximumLength(100)
                .When(x => !string.IsNullOrWhiteSpace(x.EntityType));

            RuleFor(x => x.FromDateUtc)
                .LessThanOrEqualTo(x => x.ToDateUtc.GetValueOrDefault())
                .When(x => x.FromDateUtc.HasValue && x.ToDateUtc.HasValue)
                .WithMessage("FromDateUtc must be less than or equal to ToDateUtc.");
        }
    }
}
