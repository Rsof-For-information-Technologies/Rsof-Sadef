using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.ActivityLogDtos;

namespace Sadef.API.Controllers
{
    public class ActivityLogsController : ApiBaseController
    {
        private readonly IActivityLogService _activityLogService;

        public ActivityLogsController(IActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs([FromQuery] ActivityLogFilterDto filters, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _activityLogService.GetLogsAsync(filters, pageNumber, pageSize);
            return Ok(result);
        }
    }
}
