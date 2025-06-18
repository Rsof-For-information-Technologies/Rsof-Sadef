using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.MaintenanceRequestDtos;

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
    }
}
