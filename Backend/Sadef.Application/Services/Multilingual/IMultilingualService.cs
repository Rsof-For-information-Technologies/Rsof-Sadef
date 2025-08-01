using Sadef.Domain.PropertyEntity;

namespace Sadef.Application.Services.Multilingual
{
    public interface IMultilingualService
    {
        Task<Property> GetLocalizedContentAsync(Property property, string currentLanguage, string defaultLanguage);
        Task<List<Property>> GetLocalizedContentAsync(List<Property> properties, string currentLanguage, string defaultLanguage);
        Task<bool> SaveTranslationsAsync<T>(int entityId, Dictionary<string, object> translations) where T : class;
    }
} 