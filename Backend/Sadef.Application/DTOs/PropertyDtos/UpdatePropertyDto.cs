using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class UpdatePropertyDto
    {
        public int Id { get; set; }
        public  string Title { get; set; }
        public  string Description { get; set; }
        public  decimal Price { get; set; }
        public PropertyType PropertyType { get; set; }
        public UnitCategory? UnitCategory { get; set; }
        public  string City { get; set; }
        public  string Location { get; set; }
        public  double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public List<IFormFile>? Images { get; set; }
        public PropertyStatus Status { get; set; }
        public List<IFormFile>? Videos { get; set; }
        public string? UnitName { get; set; }
        public decimal? ProjectedResaleValue { get; set; }
        public decimal? ExpectedAnnualRent { get; set; }
        public string? WarrantyInfo { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? WhatsAppNumber { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public bool IsInvestorOnly { get; set; } = false;
        public List<FeatureList>? Features { get; set; }
        public int? TotalFloors { get; set; }

    }
}
