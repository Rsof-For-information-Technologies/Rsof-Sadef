using FluentValidation;
using Sadef.Application.DTOs.MaintenanceRequestDtos;

namespace Sadef.Application.Services.MaintenanceRequest
{
    public class CreateMaintenanceRequestDtoValidator : AbstractValidator<CreateMaintenanceRequestDto>
    {
        public CreateMaintenanceRequestDtoValidator()
        {
            RuleFor(x => x.LeadId).GreaterThan(0).WithMessage("Lead ID is required. Please Enter a valid ID.");
            RuleFor(x => x.Description).NotEmpty().MaximumLength(1000);
        }
    }
}
