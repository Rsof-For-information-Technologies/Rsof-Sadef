using FluentValidation;
using Sadef.Application.DTOs.PropertyDtos;

namespace Sadef.Application.Services.PropertyListing
{
    public class CreatePropertyValidator : AbstractValidator<CreatePropertyDto>
    {
        public CreatePropertyValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Property title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Property description is required.")
                .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero.");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required.");

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage("Location is required.");

            RuleFor(x => x.AreaSize)
                .GreaterThan(0).WithMessage("Area size must be greater than zero.");

            RuleFor(x => x.Bedrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bedrooms.HasValue)
                .WithMessage("Bedrooms must be zero or more.");

            RuleFor(x => x.Bathrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bathrooms.HasValue)
                .WithMessage("Bathrooms must be zero or more.");

            RuleFor(x => x.Videos)
                .Must(v => v == null || v.Count <= 3)
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage("You can upload up to 3 videos only.");

            RuleForEach(x => x.Videos)
                .Must(v => v.Length <= 50 * 1024 * 1024) // 50MB
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage("Each video must be 50MB or smaller.");

            RuleFor(x => x.MetaTitle)
                .MaximumLength(255).WithMessage("Meta title cannot exceed 255 characters.");

            RuleFor(x => x.MetaDescription)
                .MaximumLength(500).WithMessage("Meta description cannot exceed 500 characters.");

            RuleFor(x => x.MetaKeywords)
                .MaximumLength(255).WithMessage("Meta keywords cannot exceed 255 characters.");

            RuleFor(x => x.CanonicalUrl)
                .MaximumLength(2083).WithMessage("Canonical URL cannot exceed 2083 characters.")
                .Matches(@"^(https?://)?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})(/.*)?$")
                .When(x => !string.IsNullOrWhiteSpace(x.CanonicalUrl))
                .WithMessage("Canonical URL format is invalid.");

            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage("Slug must not exceed 200 characters.")
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
                .WithMessage("Slug must be URL-friendly (lowercase letters, numbers, and dashes only).");

        }
    }

    public class UpdatePropertyValidator : AbstractValidator<UpdatePropertyDto>
    {
        public UpdatePropertyValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Invalid property ID.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Property title is required.")
                .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Property description is required.")
                .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than zero.");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("City is required.");

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage("Location is required.");

            RuleFor(x => x.AreaSize)
                .GreaterThan(0).WithMessage("Area size must be greater than zero.");

            RuleFor(x => x.Bedrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bedrooms.HasValue)
                .WithMessage("Bedrooms must be zero or more.");

            RuleFor(x => x.Bathrooms)
                .GreaterThanOrEqualTo(0).When(x => x.Bathrooms.HasValue)
                .WithMessage("Bathrooms must be zero or more.");

            RuleFor(x => x.Videos)
                 .Must(v => v == null || v.Count <= 3)
                 .When(x => x.Videos != null && x.Videos.Any())
                 .WithMessage("You can upload up to 3 videos only.");

            RuleForEach(x => x.Videos)
                .Must(v => v.Length <= 50 * 1024 * 1024) // 50MB
                .When(x => x.Videos != null && x.Videos.Any())
                .WithMessage("Each video must be 50MB or smaller.");

            RuleFor(x => x.MetaTitle)
                .MaximumLength(255).WithMessage("Meta title cannot exceed 255 characters.");

            RuleFor(x => x.MetaDescription)
                .MaximumLength(500).WithMessage("Meta description cannot exceed 500 characters.");

            RuleFor(x => x.MetaKeywords)
                .MaximumLength(255).WithMessage("Meta keywords cannot exceed 255 characters.");

            RuleFor(x => x.CanonicalUrl)
                .MaximumLength(2083).WithMessage("Canonical URL cannot exceed 2083 characters.")
                .Matches(@"^(https?://)?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})(/.*)?$")
                .When(x => !string.IsNullOrWhiteSpace(x.CanonicalUrl))
                .WithMessage("Canonical URL format is invalid.");

            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage("Slug must not exceed 200 characters.")
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
                .WithMessage("Slug must be URL-friendly (lowercase letters, numbers, and dashes only).");
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
