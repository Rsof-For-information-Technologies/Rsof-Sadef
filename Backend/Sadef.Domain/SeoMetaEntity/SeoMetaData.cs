using Sadef.Common.Domain;

namespace Sadef.Domain.SeoMetaEntity
{
    public class SeoMetaData : AggregateRootBase
    {
        public int EntityId { get; set; }
        public string EntityType { get; set; } = null!;
        public string? Slug { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? CanonicalUrl { get; set; }
    }
} 
