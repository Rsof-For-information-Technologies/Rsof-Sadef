using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class MultilingualPropertyDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string PropertyType { get; set; } = string.Empty;
        public string PropertyTypeDisplay { get; set; } = string.Empty;
        public string? UnitCategory { get; set; }
        public string UnitCategoryDisplay { get; set; } = string.Empty;
        public string City { get; set; }
        public string Location { get; set; }
        public double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public int? TotalFloors { get; set; }
        public List<string> ImageBase64Strings { get; set; }
        public string Status { get; set; } = string.Empty;
        public string StatusDisplay { get; set; } = string.Empty;
        public DateTime? ExpiryDate { get; set; }
        public bool IsExpired => ExpiryDate.HasValue && ExpiryDate.Value <= DateTime.UtcNow;
        public List<string> VideoUrls { get; set; }
        public string? UnitName { get; set; }
        public decimal? ProjectedResaleValue { get; set; }
        public decimal? ExpectedAnnualRent { get; set; }
        public string? WarrantyInfo { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? WhatsAppNumber { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public bool IsInvestorOnly { get; set; } = false;
        public List<string>? Features { get; set; }
        public bool? IsActive { get; set; } = true;
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
        
        // Multilingual properties
        public Dictionary<string, PropertyTranslationDto> Translations { get; set; } = new();
    }
} 