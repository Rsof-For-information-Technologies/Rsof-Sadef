using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.AuditLogDtos
{
    public class AuditLogFilterDto
    {
        public string? TableName { get; set; }
        public string? Action { get; set; }
        public string? KeyValues { get; set; }
        public string? UserId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
