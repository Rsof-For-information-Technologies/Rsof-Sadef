using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.PropertyDtos;
using Sadef.Common.Infrastructure.Wrappers;
using Sadef.Domain.Constants;

namespace Sadef.API.Controllers
{
    public class PropertyController : ApiBaseController
    {
        private readonly IPropertyService _propertyService;

        public PropertyController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpPost("Create")]
        public async Task<ActionResult<Response<int>>> Create([FromForm] CreatePropertyDto dto)
        {
            var result = await _propertyService.CreatePropertyAsync(dto);
            return Ok(result);
        }

        [HttpGet("Get-all")]
        public async Task<ActionResult<Response<PaginatedResponse<PropertyDto>>>> GetPaged([FromQuery] PaginationRequest request)
        {
            var result = await _propertyService.GetAllPropertiesAsync(request);
            return Ok(result);
        }

        [HttpGet("get-by-id")]
        public async Task<ActionResult<Response<PropertyDto>>> GetById(int id)
        {
            var result = await _propertyService.GetPropertyByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<ActionResult<Response<PropertyDto>>> Update([FromForm] UpdatePropertyDto dto)
        {
            var result = await _propertyService.UpdatePropertyAsync(dto);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<ActionResult<Response<string>>> Delete(int id)
        {
            var result = await _propertyService.DeletePropertyAsync(id);
            return Ok(result);
        }

        [HttpPatch("update-status")]
        public async Task<ActionResult<Response<string>>> ChangeStatus(PropertyStatusUpdateDto dto)
        {
            var result = await _propertyService.ChangeStatusAsync(dto);
            return Ok(result);
        }
        [HttpGet("filtered")]
        public async Task<ActionResult<Response<PaginatedResponse<PropertyDto>>>> GetFiltered([FromQuery] PropertyFilterRequest request)
        {
            var result = await _propertyService.GetFilteredPropertiesAsync(request);
            return Ok(result);
        }

    }
}
