using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Application.Services.Lead;

namespace Sadef.API.Controllers
{
    public class PropertyTimeLineController : ApiBaseController
    {
        private readonly IPropertyTimeLineService _propertyTimeLineService;

        public PropertyTimeLineController(IPropertyTimeLineService propertyTimeLineService)
        {
            _propertyTimeLineService = propertyTimeLineService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPropertyTimeLineLog([FromQuery] int propertyID)
        {
            var result = await _propertyTimeLineService.GetPropertyTimeLineByID(propertyID);
            return Ok(result);
        }
    }
}
