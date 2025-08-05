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
                
            RuleFor(x => x.MetaTitle)
                .MaximumLength(255).WithMessage(localizer["Property_MetaTitleMaxLength", 255]);

            RuleFor(x => x.MetaDescription)
                .MaximumLength(500).WithMessage(localizer["Property_MetaDescriptionMaxLength", 500]);

            RuleFor(x => x.MetaKeywords)
                .MaximumLength(255).WithMessage(localizer["Property_MetaKeywordsMaxLength", 255]);

            RuleFor(x => x.CanonicalUrl)
                .MaximumLength(2083).WithMessage(localizer["Property_CanonicalUrlMaxLength", 2083])
                .Matches(@"^(https?://)?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})(/.*)?$")
                .When(x => !string.IsNullOrWhiteSpace(x.CanonicalUrl))
                .WithMessage(localizer["Property_CanonicalUrlInvalid"]);

            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage(localizer["Property_SlugMaxLength", 200])
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
                .WithMessage(localizer["Property_SlugInvalid"]);
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

            RuleFor(x => x.Images)
               .Must(i => i == null || i.Count <= 10)
               .When(x => x.Images != null && x.Images.Any())
               .WithMessage(localizer["Property_MaxImages", 10]);

            RuleForEach(x => x.Images)
                .Must(i => i.Length <= 2 * 1024 * 1024) // 2MB
                .When(x => x.Images != null && x.Images.Any())
                .WithMessage(localizer["Property_ImageMaxSizeMB", 2])
                .Must(i => i.ContentType.StartsWith("image/"))
                .WithMessage(localizer["Property_ImageInvalidType"]);

            RuleFor(x => x.MetaTitle)
                .MaximumLength(255).WithMessage(localizer["Property_MetaTitleMaxLength", 255]);

            RuleFor(x => x.MetaDescription)
                .MaximumLength(500).WithMessage(localizer["Property_MetaDescriptionMaxLength", 500]);

            RuleFor(x => x.MetaKeywords)
                .MaximumLength(255).WithMessage(localizer["Property_MetaKeywordsMaxLength", 255]);

            RuleFor(x => x.CanonicalUrl)
                .MaximumLength(2083).WithMessage(localizer["Property_CanonicalUrlMaxLength", 2083])
                .Matches(@"^(https?://)?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})(/.*)?$")
                .When(x => !string.IsNullOrWhiteSpace(x.CanonicalUrl))
                .WithMessage(localizer["Property_CanonicalUrlInvalid"]);

            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage(localizer["Property_SlugMaxLength", 200])
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
                .WithMessage(localizer["Property_SlugInvalid"]);
        }
    }
    public class PropertyExpiryUpdateValidator : AbstractValidator<PropertyExpiryUpdateDto>
    {
        public PropertyExpiryUpdateValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.ExpiryDate)
                .GreaterThan(DateTime.UtcNow).WithMessage(localizer["Property_ExpiryDateFuture"]);
        }
    }

}
