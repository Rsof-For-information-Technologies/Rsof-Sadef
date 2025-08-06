namespace Sadef.Application.DTOs.PropertyDtos
{
    public class PropertyTranslationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? UnitName { get; set; }
        public string? WarrantyInfo { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
    }
} 