using Sadef.Common.Domain;

namespace Sadef.Domain.BlogsEntity
{
    public class BlogTranslation : EntityBase
    {
        public int BlogId { get; set; }
        public string LanguageCode { get; set; } = "en";
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
        public Blog Blog { get; set; } = null!;
    }
} 