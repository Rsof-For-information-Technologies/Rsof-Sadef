namespace Sadef.Application.Services.Multilingual
{
    public interface ILanguageService
    {
        /// <summary>
        /// Gets the current language from the HTTP context
        /// </summary>
        /// <returns>The current language code (e.g., "en", "ar")</returns>
        string GetCurrentLanguage();

        /// <summary>
        /// Gets the default language for fallback
        /// </summary>
        /// <returns>The default language code</returns>
        string GetDefaultLanguage();

        /// <summary>
        /// Checks if the current language is RTL (Right-to-Left)
        /// </summary>
        /// <returns>True if the current language is RTL</returns>
        bool IsRtlLanguage();
    }
} 