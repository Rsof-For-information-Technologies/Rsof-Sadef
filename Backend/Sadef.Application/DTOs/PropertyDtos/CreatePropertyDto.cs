using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sadef.Common.Infrastructure.ModelBinders;
using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class CreatePropertyDto
    {
        [ModelBinder(typeof(DecimalModelBinder))]
        public required decimal Price { get; set; }
        public PropertyType PropertyType { get; set; }
        public UnitCategory? UnitCategory { get; set; }
        public required City City { get; set; }
        public required string Location { get; set; }
        [ModelBinder(typeof(DoubleModelBinder))]
        public required double AreaSize { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }
        [ModelBinder(typeof(DecimalModelBinder))]
        public decimal? ProjectedResaleValue { get; set; }
        [ModelBinder(typeof(DecimalModelBinder))]
        public decimal? ExpectedAnnualRent { get; set; }
        [ModelBinder(typeof(DoubleModelBinder))]
        public double? Latitude { get; set; }
        [ModelBinder(typeof(DoubleModelBinder))]
        public double? Longitude { get; set; }
        public string? WhatsAppNumber { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public bool IsInvestorOnly { get; set; } = false;
        public List<FeatureList>? Features { get; set; }
        public int? TotalFloors { get; set; }
        public Dictionary<string, PropertyTranslationDto> Translations { get; set; } = new();
        public string? TranslationsJson { get; set; }
    }
}
