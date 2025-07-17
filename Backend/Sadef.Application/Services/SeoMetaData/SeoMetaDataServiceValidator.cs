using FluentValidation;
using Sadef.Application.DTOs.SeoMetaDtos;

namespace Sadef.Application.Services.SeoMetaData
{
    public class CreateSeoMetaDataValidator : AbstractValidator<CreateSeoMetaDataDto>
    {
        public CreateSeoMetaDataValidator()
        {
            RuleFor(x => x.EntityId)
                .GreaterThan(0).WithMessage("EntityId must be a positive integer.");

            RuleFor(x => x.EntityType)
                .NotEmpty().WithMessage("EntityType is required.")
                .MaximumLength(100).WithMessage("EntityType must not exceed 100 characters.");
        }
    }

    public class CreateSeoMetaDetailsValidator : AbstractValidator<CreateSeoMetaDetailsDto>
    {
        public CreateSeoMetaDetailsValidator()
        {
            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage("Slug must not exceed 200 characters.")
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
                .WithMessage("Slug must be URL-friendly (lowercase letters, numbers, and dashes only).");

            RuleFor(x => x.MetaTitle)
                .MaximumLength(80).WithMessage("MetaTitle should be under 80 characters.");

            RuleFor(x => x.MetaDescription)
                .MaximumLength(160).WithMessage("MetaDescription should be under 160 characters.");

            RuleFor(x => x.MetaKeywords)
                .MaximumLength(255).WithMessage("MetaKeywords must not exceed 255 characters.");

            RuleFor(x => x.CanonicalUrl)
                .MaximumLength(2083).WithMessage("CanonicalUrl must not exceed 2083 characters.")
                .Must(BeAValidUrl).When(x => !string.IsNullOrWhiteSpace(x.CanonicalUrl))
                .WithMessage("CanonicalUrl must be a valid URL.");
        }

        private bool BeAValidUrl(string url)
        {
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }
}
