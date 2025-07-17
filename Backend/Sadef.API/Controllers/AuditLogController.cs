using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.AuditLogDtos;

namespace Sadef.API.Controllers
{
    public class AuditLogController : ApiBaseController
    {
        private readonly IAuditLogService _auditLogService;
        
        public AuditLogController(IAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AuditLogFilterDto filters, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _auditLogService.GetPaginatedAuditLogsAsync(pageNumber, pageSize, filters);
            return Ok(result);
        }
    }
}
