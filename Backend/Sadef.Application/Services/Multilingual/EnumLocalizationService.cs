using Microsoft.Extensions.Localization;
using Sadef.Domain.Constants;
using System.Globalization;

namespace Sadef.Application.Services.Multilingual
{
    public class EnumLocalizationService : IEnumLocalizationService
    {
        private readonly IStringLocalizerFactory _localizerFactory;

        public EnumLocalizationService(IStringLocalizerFactory localizerFactory)
        {
            _localizerFactory = localizerFactory;
        }

        public string GetLocalizedEnumValue<T>(T enumValue, string languageCode) where T : Enum
        {
            var enumName = typeof(T).Name;
            var enumValueName = enumValue.ToString();
            var resourceKey = $"{enumName}_{enumValueName}";

            try
            {
                // Try different approaches to create the localizer
                var localizer = _localizerFactory.Create("Enums", "Sadef.Application");
                
                // Set the culture for the current thread
                var originalCulture = Thread.CurrentThread.CurrentUICulture;
                Thread.CurrentThread.CurrentUICulture = new CultureInfo(languageCode);
                
                var localizedValue = localizer[resourceKey];
                
                // Restore original culture
                Thread.CurrentThread.CurrentUICulture = originalCulture;
                
                // Debug: Log the resource key and result
                Console.WriteLine($"Debug: ResourceKey={resourceKey}, LanguageCode={languageCode}, Result={localizedValue}, ResourceNotFound={localizedValue.ResourceNotFound}");
                
                // If no translation found, return the original enum value
                if (localizedValue.ResourceNotFound)
                {
                    Console.WriteLine($"Debug: Resource not found for key {resourceKey}, returning enum value {enumValueName}");
                    return enumValueName;
                }

                Console.WriteLine($"Debug: Found localized value: {localizedValue}");
                return localizedValue;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Debug: Exception in GetLocalizedEnumValue: {ex.Message}");
                return enumValueName;
            }
        }

        public string GetLocalizedPropertyStatus(PropertyStatus status, string languageCode)
        {
            return GetLocalizedEnumValue(status, languageCode);
        }

        public string GetLocalizedPropertyType(PropertyType type, string languageCode)
        {
            return GetLocalizedEnumValue(type, languageCode);
        }

        public string GetLocalizedUnitCategory(UnitCategory category, string languageCode)
        {
            return GetLocalizedEnumValue(category, languageCode);
        }

        public string GetLocalizedFeatureList(FeatureList feature, string languageCode)
        {
            return GetLocalizedEnumValue(feature, languageCode);
        }

        // Test method to verify localization is working
        public void TestLocalization()
        {
            Console.WriteLine("Testing localization...");
            
            // Test English
            var englishVilla = GetLocalizedPropertyType(PropertyType.Villa, "en");
            Console.WriteLine($"English Villa: {englishVilla}");
            
            // Test Arabic
            var arabicVilla = GetLocalizedPropertyType(PropertyType.Villa, "ar");
            Console.WriteLine($"Arabic Villa: {arabicVilla}");
            
            // Test English Status
            var englishApproved = GetLocalizedPropertyStatus(PropertyStatus.Approved, "en");
            Console.WriteLine($"English Approved: {englishApproved}");
            
            // Test Arabic Status
            var arabicApproved = GetLocalizedPropertyStatus(PropertyStatus.Approved, "ar");
            Console.WriteLine($"Arabic Approved: {arabicApproved}");
        }
    }
} 