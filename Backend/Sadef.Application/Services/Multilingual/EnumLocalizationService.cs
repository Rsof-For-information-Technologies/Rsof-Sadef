using Microsoft.Extensions.Localization;
using System.Reflection;
using Sadef.Domain.Constants;

namespace Sadef.Application.Services.Multilingual
{
    public class EnumLocalizationService : IEnumLocalizationService
    {
        private readonly IStringLocalizer _localizer;

        public EnumLocalizationService(IStringLocalizerFactory localizerFactory)
        {
            _localizer = localizerFactory.Create("EnumResources", "Sadef.Application");
        }

        /// <summary>
        /// Generic method to get localized enum value for any enum type
        /// </summary>
        public string GetLocalizedEnumValue<T>(T enumValue, string languageCode = "en") where T : Enum
        {
            var enumType = typeof(T);
            var enumName = enumType.Name;
            var enumValueName = enumValue.ToString();
            var resourceKey = $"{enumName}_{enumValueName}";

            var localizedValue = _localizer[resourceKey];
            
            // If no localized value found, return the enum name
            return string.IsNullOrEmpty(localizedValue) ? enumValueName : localizedValue;
        }

        /// <summary>
        /// Get all localized enum values for dropdowns or listings
        /// </summary>
        public List<EnumLocalizationDto> GetAllLocalizedEnumValues<T>(string languageCode = "en") where T : Enum
        {
            var enumType = typeof(T);
            var enumName = enumType.Name;
            var result = new List<EnumLocalizationDto>();

            foreach (T enumValue in Enum.GetValues(enumType))
            {
                var enumValueName = enumValue.ToString();
                var resourceKey = $"{enumName}_{enumValueName}";
                var localizedValue = _localizer[resourceKey];

                result.Add(new EnumLocalizationDto
                {
                    Value = Convert.ToInt32(enumValue),
                    Name = enumValueName,
                    DisplayName = string.IsNullOrEmpty(localizedValue) ? enumValueName : localizedValue
                });
            }

            return result;
        }

        #region Specific Enum Methods for Backward Compatibility

        public string GetLocalizedPropertyType(PropertyType propertyType, string languageCode = "en")
        {
            return GetLocalizedEnumValue(propertyType, languageCode);
        }

        public string GetLocalizedUnitCategory(UnitCategory unitCategory, string languageCode = "en")
        {
            return GetLocalizedEnumValue(unitCategory, languageCode);
        }

        public string GetLocalizedPropertyStatus(PropertyStatus propertyStatus, string languageCode = "en")
        {
            return GetLocalizedEnumValue(propertyStatus, languageCode);
        }

        public string GetLocalizedCity(City city, string languageCode = "en")
        {
            return GetLocalizedEnumValue(city, languageCode);
        }

        public string GetLocalizedFeatureList(FeatureList feature, string languageCode = "en")
        {
            return GetLocalizedEnumValue(feature, languageCode);
        }

        #endregion
    }

    /// <summary>
    /// DTO for enum localization responses
    /// </summary>
    public class EnumLocalizationDto
    {
        public int Value { get; set; }
        public string Name { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
    }
} 