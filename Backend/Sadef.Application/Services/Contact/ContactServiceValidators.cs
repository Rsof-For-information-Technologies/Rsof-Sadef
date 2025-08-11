using FluentValidation;
using Sadef.Application.DTOs.ContactDtos;
using Microsoft.Extensions.Localization;
using System.Text.Json;

namespace Sadef.Application.Services.Contact
{
    public class CreateContactValidator : AbstractValidator<CreateContactDto>
    {
        public CreateContactValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage(localizer["Contact_FullNameRequired"])
                .MaximumLength(100).WithMessage(localizer["Contact_FullNameMaxLength", 100]);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage(localizer["Contact_EmailRequired"])
                .EmailAddress().WithMessage(localizer["Contact_EmailInvalid"]);

            RuleFor(x => x.Phone)
                .MaximumLength(20).When(x => !string.IsNullOrWhiteSpace(x.Phone))
                .WithMessage(localizer["Contact_PhoneMaxLength", 20]);

            RuleFor(x => x.Budget)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.Budget))
                .WithMessage(localizer["Contact_BudgetMaxLength", 100]);

            RuleFor(x => x.PropertyType)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.PropertyType))
                .WithMessage(localizer["Contact_PropertyTypeMaxLength", 100]);

            RuleFor(x => x.Type)
                .IsInEnum().WithMessage(localizer["Contact_TypeInvalid"]);

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
                            var translations = JsonSerializer.Deserialize<Dictionary<string, ContactTranslationDto>>(dto.TranslationsJson, options);
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
                .WithMessage(localizer["Contact_AtLeastOneTranslationRequired"]);

            // Validate individual translations when provided directly
            When(x => x.Translations != null && x.Translations.Any(), () =>
            {
                RuleForEach(x => x.Translations)
                    .SetValidator(new TranslationDictionaryValidator(localizer));
            });
        }
    }

    public class UpdateContactValidator : AbstractValidator<UpdateContactDto>
    {
        public UpdateContactValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Contact_IdRequired"]);

            RuleFor(x => x.FullName)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.FullName))
                .WithMessage(localizer["Contact_FullNameMaxLength", 100]);

            RuleFor(x => x.Email)
                .EmailAddress().WithMessage(localizer["Contact_EmailInvalid"])
                .When(x => !string.IsNullOrWhiteSpace(x.Email));

            RuleFor(x => x.Phone)
                .MaximumLength(20).When(x => !string.IsNullOrWhiteSpace(x.Phone))
                .WithMessage(localizer["Contact_PhoneMaxLength", 20]);

            RuleFor(x => x.Budget)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.Budget))
                .WithMessage(localizer["Contact_BudgetMaxLength", 100]);

            RuleFor(x => x.PropertyType)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.PropertyType))
                .WithMessage(localizer["Contact_PropertyTypeMaxLength", 100]);

            RuleFor(x => x.Type)
                .IsInEnum().When(x => x.Type.HasValue)
                .WithMessage(localizer["Contact_TypeInvalid"]);

            RuleFor(x => x.Status)
                .IsInEnum().When(x => x.Status.HasValue)
                .WithMessage(localizer["Contact_StatusInvalid"]);

            // Validate TranslationsJson if provided
            When(x => !string.IsNullOrEmpty(x.TranslationsJson), () =>
            {
                RuleFor(x => x.TranslationsJson)
                    .Must((dto, translationsJson) =>
                    {
                        try
                        {
                            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                            var translations = JsonSerializer.Deserialize<Dictionary<string, ContactTranslationDto>>(translationsJson, options);
                            return translations != null && translations.Any();
                        }
                        catch (JsonException)
                        {
                            return false;
                        }
                    })
                    .WithMessage(localizer["Contact_InvalidTranslationsJson"]);
            });

            // Validate translations if provided directly
            When(x => x.Translations != null && x.Translations.Any(), () =>
            {
                RuleForEach(x => x.Translations)
                    .SetValidator(new TranslationDictionaryValidator(localizer));
            });
        }
    }

    public class UpdateContactStatusValidator : AbstractValidator<UpdateContactStatusDto>
    {
        public UpdateContactStatusValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage(localizer["Contact_IdRequired"]);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage(localizer["Contact_StatusInvalid"]);
        }
    }

    public class ContactTranslationValidator : AbstractValidator<ContactTranslationDto>
    {
        public ContactTranslationValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage(localizer["Contact_SubjectRequired"])
                .MaximumLength(200).WithMessage(localizer["Contact_SubjectMaxLength", 200]);

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage(localizer["Contact_MessageRequired"])
                .MinimumLength(10).WithMessage(localizer["Contact_MessageMinLength", 10])
                .MaximumLength(1000).WithMessage(localizer["Contact_MessageMaxLength", 1000]);

            RuleFor(x => x.PreferredContactMethod)
                .MaximumLength(100).When(x => !string.IsNullOrWhiteSpace(x.PreferredContactMethod))
                .WithMessage(localizer["Contact_PreferredContactMethodMaxLength", 100]);

            RuleFor(x => x.Location)
                .MaximumLength(200).When(x => !string.IsNullOrWhiteSpace(x.Location))
                .WithMessage(localizer["Contact_LocationMaxLength", 200]);
        }
    }

    public class TranslationDictionaryValidator : AbstractValidator<KeyValuePair<string, ContactTranslationDto>>
    {
        public TranslationDictionaryValidator(IStringLocalizer localizer)
        {
            RuleFor(x => x.Key)
                .NotEmpty().WithMessage(localizer["Contact_LanguageCodeRequired"])
                .Must(key => key == "en" || key == "ar").WithMessage(localizer["Contact_InvalidLanguageCode"]);

            RuleFor(x => x.Value)
                .SetValidator(new ContactTranslationValidator(localizer));
        }
    }
} 