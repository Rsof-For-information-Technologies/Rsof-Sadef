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
        }
    }
    public class UpdateMaintenanceRequestStatusValidator : AbstractValidator<UpdateMaintenanceRequestStatusDto>
    {
        public UpdateMaintenanceRequestStatusValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage("Maintenance request ID must be a positive number.");

            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Invalid status provided.");
        }
    }
}
