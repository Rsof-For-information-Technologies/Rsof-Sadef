using FluentValidation;
using Sadef.Application.DTOs.MaintenanceRequestDtos;

namespace Sadef.Application.Services.MaintenanceRequest
{
    public class CreateMaintenanceRequestValidator : AbstractValidator<CreateMaintenanceRequestDto>
    {
        public CreateMaintenanceRequestValidator()
        {
            RuleFor(x => x.LeadId)
                .GreaterThan(0)
                .WithMessage("Lead ID is required. Please enter a valid ID.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(1000)
                .WithMessage("Description is required and must be less than 1000 characters.");

            RuleFor(x => x.Videos)
                .Must(v => v == null || v.Count <= 3)
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage("You can upload up to 3 videos only.");

            RuleForEach(x => x.Videos)
                .Must(v => v.Length <= 50 * 1024 * 1024) // 50MB
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage("Each video must be 50MB or smaller.");
        }
    }
    public class UpdateMaintenanceRequestStatusValidator : AbstractValidator<UpdateMaintenanceRequestDto>
    {
        public UpdateMaintenanceRequestStatusValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage("Maintenance request ID must be a positive number.");
        }
    }
}
