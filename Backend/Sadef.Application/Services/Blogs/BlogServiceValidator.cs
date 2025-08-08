using FluentValidation;
using Sadef.Application.DTOs.BlogDtos;
using Microsoft.Extensions.Localization;
using System.Text.Json;

namespace Sadef.Application.Services.Blogs
{
    public class CreateBlogValidator : AbstractValidator<CreateBlogDto>
    {
        public CreateBlogValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.IsPublished)
                .NotNull().WithMessage(localizer["Required", "IsPublished"]);

            // Validate that either TranslationsJson is provided OR Translations is not empty
            RuleFor(x => x)
                .Must(dto =>
                {
                    // If TranslationsJson is provided, validate it
                    if (!string.IsNullOrEmpty(dto.TranslationsJson))
                    {
                        try
                        {
                            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                            var translations = JsonSerializer.Deserialize<Dictionary<string, BlogTranslationDto>>(dto.TranslationsJson, options);
                            return translations != null && translations.Any();
                        }
                        catch (JsonException)
                        {
                            return false;
                        }
                    }
                    
                    // If Translations is provided directly, validate it
                    if (dto.Translations != null && dto.Translations.Any())
                    {
                        return true;
                    }
                    
                    // Neither is provided
                    return false;
                })
                .WithMessage(localizer["Blog_AtLeastOneTranslationRequired"]);

            // Validate individual translations when provided directly
            When(x => x.Translations != null && x.Translations.Any(), () =>
            {
                RuleForEach(x => x.Translations)
                    .SetValidator(new TranslationDictionaryValidator(localizer));
            });
        }
    }

    public class UpdateBlogValidator : AbstractValidator<UpdateBlogDto>
    {
        public UpdateBlogValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Invalid_BlogId"]);

            RuleFor(x => x.IsPublished)
                .NotNull().WithMessage(localizer["Required", "IsPublished"]);

            // Validate TranslationsJson if provided
            When(x => !string.IsNullOrEmpty(x.TranslationsJson), () =>
            {
                RuleFor(x => x.TranslationsJson)
                    .Must((dto, translationsJson) =>
                    {
                        try
                        {
                            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                            var translations = JsonSerializer.Deserialize<Dictionary<string, BlogTranslationDto>>(translationsJson, options);
                            return translations != null && translations.Any();
                        }
                        catch (JsonException)
                        {
                            return false;
                        }
                    })
                    .WithMessage(localizer["Blog_InvalidTranslationsJson"]);
            });

            When(x => x.Translations != null, () =>
            {
                RuleFor(x => x.Translations)
                    .Must(translations => translations != null && translations.Any())
                    .WithMessage(localizer["Blog_AtLeastOneTranslationRequired"]);

                RuleForEach(x => x.Translations)
                    .SetValidator(new TranslationDictionaryValidator(localizer));
            });
        }
    }

    public class BlogTranslationValidator : AbstractValidator<BlogTranslationDto>
    {
        public BlogTranslationValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage(localizer["Required", "Title"])
                .MaximumLength(150).WithMessage(localizer["Title_MaxLength", 150]);

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage(localizer["Required", "Content"])
                .MinimumLength(20).WithMessage(localizer["Content_MinLength", 20]);

            RuleFor(x => x.MetaTitle)
                .MaximumLength(255).WithMessage(localizer["Blog_MetaTitleMaxLength", 255]);

            RuleFor(x => x.MetaDescription)
                .MaximumLength(500).WithMessage(localizer["Blog_MetaDescriptionMaxLength", 500]);

            RuleFor(x => x.MetaKeywords)
                .MaximumLength(255).WithMessage(localizer["Blog_MetaKeywordsMaxLength", 255]);

            RuleFor(x => x.CanonicalUrl)
                .MaximumLength(2083).WithMessage(localizer["Blog_CanonicalUrlMaxLength", 2083])
                .Matches(@"^(https?://)?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,})(/.*)?$")
                .When(x => !string.IsNullOrWhiteSpace(x.CanonicalUrl))
                .WithMessage(localizer["Blog_CanonicalUrlInvalid"]);

            RuleFor(x => x.Slug)
                .MaximumLength(200).WithMessage(localizer["Blog_SlugMaxLength", 200])
                .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").When(x => !string.IsNullOrWhiteSpace(x.Slug))
                .WithMessage(localizer["Blog_SlugInvalid"]);
        }
    }

    public class TranslationDictionaryValidator : AbstractValidator<KeyValuePair<string, BlogTranslationDto>>
    {
        public TranslationDictionaryValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Key)
                .NotEmpty().WithMessage(localizer["Blog_LanguageCodeRequired"])
                .Must(langCode => langCode == "en" || langCode == "ar")
                .WithMessage(localizer["Blog_InvalidLanguageCode"]);

            RuleFor(x => x.Value)
                .SetValidator(new BlogTranslationValidator(localizer));
        }
    }
}
