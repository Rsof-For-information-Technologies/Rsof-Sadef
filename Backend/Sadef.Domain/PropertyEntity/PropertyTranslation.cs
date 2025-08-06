using Sadef.Common.Domain;

namespace Sadef.Domain.PropertyEntity
{
    public class PropertyTranslation : EntityBase
    {
        public int PropertyId { get; set; }
        public string LanguageCode { get; set; } = "en";
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? UnitName { get; set; }
        public string? WarrantyInfo { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
        public Property Property { get; set; } = null!;
    }
} 