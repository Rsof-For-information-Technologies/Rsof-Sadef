using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Application.Services.MaintenanceRequest;

namespace Sadef.API.Controllers
{
    public class MaintenanceRequestController : ApiBaseController
    {
        private readonly IMaintenanceRequestService _maintenanceService;

        public MaintenanceRequestController(IMaintenanceRequestService maintenanceService)
        {
            _maintenanceService = maintenanceService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRequest([FromForm] CreateMaintenanceRequestDto dto)
        {
            var result = await _maintenanceService.CreateRequestAsync(dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] MaintenanceRequestFilterDto filters, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _maintenanceService.GetPaginatedAsync(pageNumber, pageSize, filters);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _maintenanceService.GetByIdAsync(id);
            return Ok(result);
        }
    }
}
