using Sadef.Common.Domain;
using Sadef.Domain.Constants;

namespace Sadef.Domain.PropertyEntity
{
    public class Property : AggregateRootBase
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required decimal Price { get; set; }
        public required PropertyType PropertyType { get; set; }
        public required string? City { get; set; }
        public required string Location { get; set; }
        public required double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public ICollection<PropertyImage>? Images { get; set; }
        public PropertyStatus Status { get; set; } = PropertyStatus.Pending;

    }

}
