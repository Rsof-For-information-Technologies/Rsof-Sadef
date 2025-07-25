using FluentValidation;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Microsoft.Extensions.Localization;

namespace Sadef.Application.Services.MaintenanceRequest
{
    public class CreateMaintenanceRequestValidator : AbstractValidator<CreateMaintenanceRequestDto>
    {
        public CreateMaintenanceRequestValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.LeadId)
                .GreaterThan(0)
                .WithMessage(localizer["MaintenanceRequest_LeadIdRequired"]);

            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(1000)
                .WithMessage(localizer["MaintenanceRequest_DescriptionRequired"]);

            RuleFor(x => x.Videos)
                .Must(v => v == null || v.Count <= 3)
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage(localizer["MaintenanceRequest_MaxVideos", 3]);

            RuleForEach(x => x.Videos)
                .Must(v => v.Length <= 50 * 1024 * 1024) // 50MB
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage(localizer["MaintenanceRequest_VideoMaxSizeMB", 50]);
        }
    }
    public class UpdateMaintenanceRequestStatusValidator : AbstractValidator<UpdateMaintenanceRequestDto>
    {
        public UpdateMaintenanceRequestStatusValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage(localizer["MaintenanceRequest_IdPositive"]);
        }
    }
}
