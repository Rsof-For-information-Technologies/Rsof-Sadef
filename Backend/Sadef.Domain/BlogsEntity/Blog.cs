using Sadef.Common.Domain;

namespace Sadef.Domain.BlogsEntity
{
    public class Blog : AggregateRootBase
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public string? CoverImage { get; set; }
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        public bool IsPublished { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
    }

}
