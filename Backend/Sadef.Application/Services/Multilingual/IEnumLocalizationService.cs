using Sadef.Domain.Constants;

namespace Sadef.Application.Services.Multilingual
{
    public interface IEnumLocalizationService
    {
        string GetLocalizedEnumValue<T>(T enumValue, string languageCode) where T : Enum;
        string GetLocalizedPropertyStatus(PropertyStatus status, string languageCode);
        string GetLocalizedPropertyType(PropertyType type, string languageCode);
        string GetLocalizedUnitCategory(UnitCategory category, string languageCode);
        string GetLocalizedFeatureList(FeatureList feature, string languageCode);
    }
} 