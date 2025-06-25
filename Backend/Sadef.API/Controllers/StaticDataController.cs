using Microsoft.AspNetCore.Mvc;
using Sadef.Domain.Constants;
using System;
using System.Linq;

namespace Sadef.API.Controllers
{
    public class StaticDataController : ApiBaseController
    {
        [HttpGet("property-statuses")]
        public IActionResult GetPropertyStatuses()
        {
            var list = Enum.GetValues(typeof(PropertyStatus))
                .Cast<PropertyStatus>()
                .Select(x => new { value = (int)x, name = x.ToString() })
                .ToList();
            return Ok(list);
        }

        [HttpGet("property-types")]
        public IActionResult GetPropertyTypes()
        {
            var list = Enum.GetValues(typeof(PropertyType))
                .Cast<PropertyType>()
                .Select(x => new { value = (int)x, name = x.ToString() })
                .ToList();
            return Ok(list);
        }

        [HttpGet("unit-categories")]
        public IActionResult GetUnitCategories()
        {
            var list = Enum.GetValues(typeof(UnitCategory))
                .Cast<UnitCategory>()
                .Select(x => new { value = (int)x, name = x.ToString() })
                .ToList();
            return Ok(list);
        }

        [HttpGet("features")]
        public IActionResult GetFeatures()
        {
            var features = Enum.GetValues(typeof(FeatureList))
                .Cast<FeatureList>()
                .Select(x => new { value = (int)x, name = x.ToString() }).ToList();
            return Ok(features);
        }
    }
} 