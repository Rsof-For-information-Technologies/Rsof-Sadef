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

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] LeadFilterDto filters, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, bool isExport = false)
        {
            var result = await _leadService.GetPaginatedAsync(pageNumber, pageSize, filters, isExport);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _leadService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLead([FromBody] UpdateLeadDto dto)
        {
            var result = await _leadService.UpdateLeadAsync(dto);
            return Ok(result);
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetLeadStats()
        {
            var result = await _leadService.GetLeadDashboardStatsAsync();
            return Ok(result);
        }

    }
}
