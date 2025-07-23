using FluentValidation;
using Sadef.Application.DTOs.PropertyDtos;
using Microsoft.Extensions.Localization;

namespace Sadef.Application.Services.PropertyListing
{
    public class CreatePropertyValidator : AbstractValidator<CreatePropertyDto>
    {
        public CreatePropertyValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage(localizer["Property_TitleRequired"])
                .MaximumLength(100).WithMessage(localizer["Property_TitleMaxLength", 100]);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage(localizer["Property_DescriptionRequired"])
                .MaximumLength(1000).WithMessage(localizer["Property_DescriptionMaxLength", 1000]);

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage(localizer["Property_PriceGreaterThanZero"]);

            RuleFor(x => x.City)
                .NotEmpty().WithMessage(localizer["Property_CityRequired"]);

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage(localizer["Property_LocationRequired"]);

            RuleFor(x => x.AreaSize)
                .GreaterThan(0).WithMessage(localizer["Property_AreaSizeGreaterThanZero"]);

            RuleFor(x => x.Bedrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bedrooms.HasValue)
                .WithMessage(localizer["Property_BedroomsZeroOrMore"]);

            RuleFor(x => x.Bathrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bathrooms.HasValue)
                .WithMessage(localizer["Property_BathroomsZeroOrMore"]);

            RuleFor(x => x.Videos)
                .Must(v => v == null || v.Count <= 3)
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage(localizer["Property_MaxVideos", 3]);

            RuleForEach(x => x.Videos)
                .Must(v => v.Length <= 50 * 1024 * 1024) // 50MB
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage(localizer["Property_VideoMaxSizeMB", 50]);
        }
    }

    public class UpdatePropertyValidator : AbstractValidator<UpdatePropertyDto>
    {
        public UpdatePropertyValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Property_InvalidId"]);

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage(localizer["Property_TitleRequired"])
                .MaximumLength(100).WithMessage(localizer["Property_TitleMaxLength", 100]);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage(localizer["Property_DescriptionRequired"])
                .MaximumLength(1000).WithMessage(localizer["Property_DescriptionMaxLength", 1000]);

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage(localizer["Property_PriceGreaterThanZero"]);

            RuleFor(x => x.City)
                .NotEmpty().WithMessage(localizer["Property_CityRequired"]);

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage(localizer["Property_LocationRequired"]);

            RuleFor(x => x.AreaSize)
                .GreaterThan(0).WithMessage(localizer["Property_AreaSizeGreaterThanZero"]);

            RuleFor(x => x.Bedrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bedrooms.HasValue)
                .WithMessage(localizer["Property_BedroomsZeroOrMore"]);

            RuleFor(x => x.Bathrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bathrooms.HasValue)
                .WithMessage(localizer["Property_BathroomsZeroOrMore"]);

            RuleFor(x => x.Videos)
                 .Must(v => v == null || v.Count <= 3)
                 .When(x => x.Videos != null && x.Videos.Any())
                 .WithMessage(localizer["Property_MaxVideos", 3]);

            RuleForEach(x => x.Videos)
                .Must(v => v.Length <= 50 * 1024 * 1024) // 50MB
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage(localizer["Property_VideoMaxSizeMB", 50]);
        }
    }
    public class PropertyExpiryUpdateValidator : AbstractValidator<PropertyExpiryUpdateDto>
    {
        public PropertyExpiryUpdateValidator()
        {
            RuleFor(x => x.ExpiryDate)
                .GreaterThan(DateTime.UtcNow).WithMessage("Expiry date must be in the future.");
        }
    }

}
