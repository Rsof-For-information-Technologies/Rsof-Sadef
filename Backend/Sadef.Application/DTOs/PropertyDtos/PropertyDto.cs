using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class PropertyDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? UnitName { get; set; }
        public string? WarrantyInfo { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public string? MetaKeywords { get; set; }
        public string? Slug { get; set; }
        public string? CanonicalUrl { get; set; }
        public decimal Price { get; set; }
        public int PropertyType { get; set; }
        public int? UnitCategory { get; set; }
        public int City { get; set; }
        public string Location { get; set; } = string.Empty;
        public double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public int? TotalFloors { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public int Status { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool IsExpired => ExpiryDate.HasValue && ExpiryDate.Value <= DateTime.UtcNow;
        public List<string> VideoUrls { get; set; } = new();
        public decimal? ProjectedResaleValue { get; set; }
        public decimal? ExpectedAnnualRent { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? WhatsAppNumber { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public bool IsInvestorOnly { get; set; } = false;
        public List<int>? Features { get; set; }
        public bool? IsActive { get; set; } = true;
        public int ContentLanguage { get; set; }
    }
}
