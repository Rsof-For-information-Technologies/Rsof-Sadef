using Sadef.Domain.Constants;

namespace Sadef.Application.Services.Multilingual
{
    public interface IEnumLocalizationService
    {
        string GetLocalizedEnumValue<T>(T enumValue, string languageCode = "en") where T : Enum;
        List<EnumLocalizationDto> GetAllLocalizedEnumValues<T>(string languageCode = "en") where T : Enum;
        string GetLocalizedPropertyType(PropertyType propertyType, string languageCode = "en");
        string GetLocalizedUnitCategory(UnitCategory unitCategory, string languageCode = "en");
        string GetLocalizedPropertyStatus(PropertyStatus propertyStatus, string languageCode = "en");
        string GetLocalizedCity(City city, string languageCode = "en");
        string GetLocalizedFeatureList(FeatureList feature, string languageCode = "en");
    }
} 