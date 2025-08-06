using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using System.Globalization;
using System.Linq;

namespace Sadef.Common.Infrastructure.Middlewares
{
    public class LanguageMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _defaultLanguage = "ar";

        public LanguageMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Get language from Accept-Language header
            var acceptLanguage = context.Request.Headers["Accept-Language"].FirstOrDefault();
            var language = GetLanguageFromHeader(acceptLanguage);

            // Set the language in the context items for use in services
            context.Items["CurrentLanguage"] = language;

            // Set the culture for the current request
            var culture = new CultureInfo(language);
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;

            await _next(context);
        }

        private string GetLanguageFromHeader(string? acceptLanguage)
        {
            if (string.IsNullOrEmpty(acceptLanguage))
                return _defaultLanguage;

            // Parse Accept-Language header (e.g., "en-US,en;q=0.9,ar;q=0.8")
            var languages = acceptLanguage.Split(',')
                .Select(lang => lang.Split(';')[0].Trim())
                .ToList();

            // Check for Arabic first (RTL language)
            var arabicLanguage = languages.FirstOrDefault(lang => 
                lang.StartsWith("ar", StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(arabicLanguage))
                return "ar";

            // Check for English
            var englishLanguage = languages.FirstOrDefault(lang => 
                lang.StartsWith("en", StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(englishLanguage))
                return "en";

            // Default to Arabic
            return _defaultLanguage;
        }
    }

    public static class LanguageMiddlewareExtensions
    {
        public static IApplicationBuilder UseLanguageDetection(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LanguageMiddleware>();
        }
    }
} 