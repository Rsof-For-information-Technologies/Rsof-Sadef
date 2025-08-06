using Sadef.Common.Domain;
using Sadef.Domain.Constants;

namespace Sadef.Domain.PropertyEntity
{
    public class Property : AggregateRootBase
    {
        // Static fields (non-translatable) - kept in main table
        public required decimal Price { get; set; }
        public required PropertyType PropertyType { get; set; }
        public UnitCategory? UnitCategory { get; set; }
        public required City? City { get; set; }
        public required string Location { get; set; }
        public required double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public ICollection<PropertyImage>? Images { get; set; }
        public PropertyStatus Status { get; set; } = PropertyStatus.Pending;
        public DateTime? ExpiryDate { get; set; }
        public ICollection<PropertyVideo>? Videos { get; set; }
        public decimal? ProjectedResaleValue { get; set; }
        public decimal? ExpectedAnnualRent { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? WhatsAppNumber { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public bool IsInvestorOnly { get; set; } = false;
        public List<FeatureList>? Features { get; set; }
        public int? TotalFloors { get; set; }
        public bool? IsActive { get; set; } = true;
        public ContentLanguage ContentLanguage { get; set; } = ContentLanguage.English;
        public ICollection<PropertyTranslation> Translations { get; set; } = new List<PropertyTranslation>();
    }
}
