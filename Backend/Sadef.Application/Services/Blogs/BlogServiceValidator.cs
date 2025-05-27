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
