using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;

namespace Sadef.Common.Infrastructure.Middlewares
{
    public class LanguageDetectionMiddleware
    {
        private readonly RequestDelegate _next;

        public LanguageDetectionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var acceptLanguage = context.Request.Headers["Accept-Language"].FirstOrDefault();
            
            if (!string.IsNullOrEmpty(acceptLanguage))
            {
                var languages = acceptLanguage.Split(',')
                    .Select(lang => lang.Trim().Split(';')[0].ToLower())
                    .ToList();
                
                string detectedLanguage = "en"; // Default to English
                
                if (languages.Any(lang => lang.StartsWith("ar")))
                    detectedLanguage = "ar";
                else if (languages.Any(lang => lang.StartsWith("en")))
                    detectedLanguage = "en";
                
                // Store the detected language in the context for use in services
                context.Items["CurrentLanguage"] = detectedLanguage;
            }
            else
            {
                context.Items["CurrentLanguage"] = "en"; // Default to English
            }

            await _next(context);
        }
    }

    public static class LanguageDetectionMiddlewareExtensions
    {
        public static IApplicationBuilder UseLanguageDetection(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LanguageDetectionMiddleware>();
        }
    }
} 