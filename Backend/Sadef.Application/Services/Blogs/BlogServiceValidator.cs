using FluentValidation;
using Sadef.Application.DTOs.BlogDtos;

namespace Sadef.Application.Services.Blogs
{

    public class CreateBlogValidator : AbstractValidator<CreateBlogDto>
    {
        public CreateBlogValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(150).WithMessage("Title cannot exceed 150 characters.");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Content is required.")
                .MinimumLength(20).WithMessage("Content must be at least 20 characters.");

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
        public UpdateBlogValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Invalid blog ID.");

            Include(new CreateBlogValidator());
        }
    }

}
