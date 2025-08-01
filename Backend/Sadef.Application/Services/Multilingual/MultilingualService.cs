using Microsoft.EntityFrameworkCore;
using Sadef.Domain.PropertyEntity;
using Sadef.Infrastructure.DBContext;

namespace Sadef.Application.Services.Multilingual
{
    public class MultilingualService : IMultilingualService
    {
        private readonly SadefDbContext _context;

        public MultilingualService(SadefDbContext context)
        {
            _context = context;
        }

        public async Task<Property> GetLocalizedContentAsync(Property property, string currentLanguage, string defaultLanguage)
        {
            // Get translation for the requested language
            var translation = await _context.PropertyTranslations
                .FirstOrDefaultAsync(t => t.PropertyId == property.Id && t.LanguageCode == currentLanguage);

            if (translation != null)
            {
                // Apply translation to property
                property.Title = translation.Title;
                property.Description = translation.Description;
                property.UnitName = translation.UnitName;
                property.WarrantyInfo = translation.WarrantyInfo;
                property.MetaTitle = translation.MetaTitle;
                property.MetaDescription = translation.MetaDescription;
                property.MetaKeywords = translation.MetaKeywords;
                property.Slug = translation.Slug;
                property.CanonicalUrl = translation.CanonicalUrl;
            }
            else if (currentLanguage != defaultLanguage)
            {
                // Fallback to default language if requested language not found
                var defaultTranslation = await _context.PropertyTranslations
                    .FirstOrDefaultAsync(t => t.PropertyId == property.Id && t.LanguageCode == defaultLanguage);

                if (defaultTranslation != null)
                {
                    property.Title = defaultTranslation.Title;
                    property.Description = defaultTranslation.Description;
                    property.UnitName = defaultTranslation.UnitName;
                    property.WarrantyInfo = defaultTranslation.WarrantyInfo;
                    property.MetaTitle = defaultTranslation.MetaTitle;
                    property.MetaDescription = defaultTranslation.MetaDescription;
                    property.MetaKeywords = defaultTranslation.MetaKeywords;
                    property.Slug = defaultTranslation.Slug;
                    property.CanonicalUrl = defaultTranslation.CanonicalUrl;
                }
            }

            return property;
        }

        public async Task<List<Property>> GetLocalizedContentAsync(List<Property> properties, string currentLanguage, string defaultLanguage)
        {
            var localizedProperties = new List<Property>();
            
            foreach (var property in properties)
            {
                var localizedProperty = await GetLocalizedContentAsync(property, currentLanguage, defaultLanguage);
                localizedProperties.Add(localizedProperty);
            }
            
            return localizedProperties;
        }

        public async Task<bool> SaveTranslationsAsync<T>(int entityId, Dictionary<string, object> translations) where T : class
        {
            try
            {
                if (typeof(T) == typeof(Property))
                {
                    foreach (var translation in translations)
                    {
                        var languageCode = translation.Key;
                        var translationData = (Dictionary<string, object>)translation.Value;

                        var existingTranslation = await _context.PropertyTranslations
                            .FirstOrDefaultAsync(t => t.PropertyId == entityId && t.LanguageCode == languageCode);

                        if (existingTranslation != null)
                        {
                            // Update existing translation
                            existingTranslation.Title = translationData["Title"]?.ToString() ?? "";
                            existingTranslation.Description = translationData["Description"]?.ToString() ?? "";
                            existingTranslation.UnitName = translationData["UnitName"]?.ToString();
                            existingTranslation.WarrantyInfo = translationData["WarrantyInfo"]?.ToString();
                            existingTranslation.MetaTitle = translationData["MetaTitle"]?.ToString();
                            existingTranslation.MetaDescription = translationData["MetaDescription"]?.ToString();
                            existingTranslation.MetaKeywords = translationData["MetaKeywords"]?.ToString();
                            existingTranslation.Slug = translationData["Slug"]?.ToString();
                            existingTranslation.CanonicalUrl = translationData["CanonicalUrl"]?.ToString();
                        }
                        else
                        {
                            // Create new translation
                            var newTranslation = new PropertyTranslation
                            {
                                PropertyId = entityId,
                                LanguageCode = languageCode,
                                Title = translationData["Title"]?.ToString() ?? "",
                                Description = translationData["Description"]?.ToString() ?? "",
                                UnitName = translationData["UnitName"]?.ToString(),
                                WarrantyInfo = translationData["WarrantyInfo"]?.ToString(),
                                MetaTitle = translationData["MetaTitle"]?.ToString(),
                                MetaDescription = translationData["MetaDescription"]?.ToString(),
                                MetaKeywords = translationData["MetaKeywords"]?.ToString(),
                                Slug = translationData["Slug"]?.ToString(),
                                CanonicalUrl = translationData["CanonicalUrl"]?.ToString()
                            };
                            _context.PropertyTranslations.Add(newTranslation);
                        }
                    }

                    await _context.SaveChangesAsync();
                    return true;
                }

                return false; // Unsupported entity type
            }
            catch
            {
                return false;
            }
        }
    }
} 