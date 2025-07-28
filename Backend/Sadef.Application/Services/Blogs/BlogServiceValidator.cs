using FluentValidation;
using Sadef.Application.DTOs.BlogDtos;
using Microsoft.Extensions.Localization;

namespace Sadef.Application.Services.Blogs
{

    public class CreateBlogValidator : AbstractValidator<CreateBlogDto>
    {
        public CreateBlogValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage(localizer["Required", "Title"])
                .MaximumLength(150).WithMessage(localizer["Title_MaxLength", 150]);

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage(localizer["Required", "Content"])
                .MinimumLength(20).WithMessage(localizer["Content_MinLength", 20]);

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

    public class UpdateBlogValidator : AbstractValidator<UpdateBlogDto>
    {
        public UpdateBlogValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Invalid_BlogId"]);

            Include(new CreateBlogValidator(localizer));
        }
    }

}
