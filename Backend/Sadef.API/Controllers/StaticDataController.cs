using Microsoft.AspNetCore.Mvc;
using Sadef.Domain.Constants;
using Sadef.Application.Services.Multilingual;
using Sadef.Common.Infrastructure.Wrappers;
using System;
using System.Linq;
using System.Collections.Generic;

namespace Sadef.API.Controllers
{
    public class StaticDataController : ApiBaseController
    {
        private readonly IEnumLocalizationService _enumLocalizationService;

        public StaticDataController(IEnumLocalizationService enumLocalizationService)
        {
            _enumLocalizationService = enumLocalizationService;
        }

        [HttpGet("property-statuses")]
        public ActionResult<Response<List<EnumLocalizationDto>>> GetPropertyStatuses()
        {
            var languageCode = GetCurrentLanguage();
            var propertyStatuses = _enumLocalizationService.GetAllLocalizedEnumValues<PropertyStatus>(languageCode);
            return Ok(new Response<List<EnumLocalizationDto>>(propertyStatuses, "Property statuses retrieved successfully"));
        }

        [HttpGet("property-types")]
        public ActionResult<Response<List<EnumLocalizationDto>>> GetPropertyTypes()
        {
            var languageCode = GetCurrentLanguage();
            var propertyTypes = _enumLocalizationService.GetAllLocalizedEnumValues<PropertyType>(languageCode);
            return Ok(new Response<List<EnumLocalizationDto>>(propertyTypes, "Property types retrieved successfully"));
        }

        [HttpGet("unit-categories")]
        public ActionResult<Response<List<EnumLocalizationDto>>> GetUnitCategories()
        {
            var languageCode = GetCurrentLanguage();
            var unitCategories = _enumLocalizationService.GetAllLocalizedEnumValues<UnitCategory>(languageCode);
            return Ok(new Response<List<EnumLocalizationDto>>(unitCategories, "Unit categories retrieved successfully"));
        }

        [HttpGet("features")]
        public ActionResult<Response<List<EnumLocalizationDto>>> GetFeatures()
        {
            var languageCode = GetCurrentLanguage();
            var features = _enumLocalizationService.GetAllLocalizedEnumValues<FeatureList>(languageCode);
            return Ok(new Response<List<EnumLocalizationDto>>(features, "Features retrieved successfully"));
        }

        [HttpGet("cities")]
        public ActionResult<Response<List<EnumLocalizationDto>>> GetCities()
        {
            var languageCode = GetCurrentLanguage();
            var cities = _enumLocalizationService.GetAllLocalizedEnumValues<City>(languageCode);
            return Ok(new Response<List<EnumLocalizationDto>>(cities, "Cities retrieved successfully"));
        }

        private string GetCurrentLanguage()
        {
            var acceptLanguage = Request.Headers["Accept-Language"].FirstOrDefault();
            
            if (!string.IsNullOrEmpty(acceptLanguage))
            {
                var languages = acceptLanguage.Split(',')
                    .Select(lang => lang.Trim().Split(';')[0].ToLower())
                    .ToList();
                
                if (languages.Any(lang => lang.StartsWith("ar")))
                    return "ar";
                
                if (languages.Any(lang => lang.StartsWith("en")))
                    return "en";
            }
            
            return "en"; // Default to English
        }
    }
} 