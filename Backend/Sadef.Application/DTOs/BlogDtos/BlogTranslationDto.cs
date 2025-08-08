namespace Sadef.Application.DTOs.BlogDtos
{
    public class BlogTranslationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
    }
} 