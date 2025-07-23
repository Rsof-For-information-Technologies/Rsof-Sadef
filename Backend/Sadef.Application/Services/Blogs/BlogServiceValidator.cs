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
