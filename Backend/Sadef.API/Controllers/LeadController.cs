using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.LeadDtos;

namespace Sadef.API.Controllers
{
    public class LeadController : ApiBaseController
    {
        private readonly ILeadService _leadService;

        public LeadController(ILeadService leadService)
        {
            _leadService = leadService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateLead([FromBody] CreateLeadDto dto)
        {
            var result = await _leadService.CreateLeadAsync(dto);
            return Ok(result);
        }
    }
}
