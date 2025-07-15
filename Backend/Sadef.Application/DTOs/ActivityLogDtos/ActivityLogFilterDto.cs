using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.ActivityLogDtos
{
    public class ActivityLogFilterDto
    {
        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? Category { get; set; }  // e.g., "Admin", "Public"
        public string? Action { get; set; }
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public bool? IsSuccess { get; set; }
        public DateTime? FromDateUtc { get; set; }
        public DateTime? ToDateUtc { get; set; }
    }
}
