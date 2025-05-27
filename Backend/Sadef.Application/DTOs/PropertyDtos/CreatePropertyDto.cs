using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
        public class CreatePropertyDto
        {
            public required string Title { get; set; }
            public required string Description { get; set; }
            public required decimal Price { get; set; }
            public PropertyType PropertyType { get; set; }
            public UnitCategory? UnitCategory { get; set; }
            public required string City { get; set; }
            public required string Location { get; set; }
            public required double AreaSize { get; set; }
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
            public List<string>? Features { get; set; }
    }
}
