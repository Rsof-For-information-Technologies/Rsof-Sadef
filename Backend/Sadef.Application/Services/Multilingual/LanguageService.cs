using Microsoft.AspNetCore.Http;

namespace Sadef.Application.Services.Multilingual
{
    public class LanguageService : ILanguageService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string _defaultLanguage = "ar";

        public LanguageService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentLanguage()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context?.Items["CurrentLanguage"] is string language)
            {
                return language;
            }

            return _defaultLanguage;
        }

        public string GetDefaultLanguage()
        {
            return _defaultLanguage;
        }

        public bool IsRtlLanguage()
        {
            var currentLanguage = GetCurrentLanguage();
            return currentLanguage == "ar"; // Arabic is RTL
        }
    }
} 