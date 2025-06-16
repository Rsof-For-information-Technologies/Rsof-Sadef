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
        public async Task<IActionResult> GetAll([FromQuery] LeadFilterDto filters, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _leadService.GetPaginatedAsync(pageNumber, pageSize, filters);
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
            if (dto.id != 0)
            {
                var result = await _leadService.UpdateLeadAsync(dto);
                return Ok(result);
            }

            return BadRequest(dto.id == 0
                ? "ID in URL must not be zero."
                : "ID in URL and body do not match.");
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetLeadStats()
        {
            var result = await _leadService.GetLeadDashboardStatsAsync();
            return Ok(result);
        }

        [HttpGet("dashboard/report")]
        public async Task<IActionResult> ExportLeadStatsToExcel()
        {
            var fileBytes = await _leadService.ExportLeadDashboardStatsToExcelAsync();
            if (fileBytes == null)
                return BadRequest("Failed to export lead stats.");

            var fileName = $"LeadStats_{DateTime.UtcNow:yyyyMMddHHmmss}.xlsx";
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

    }
}
