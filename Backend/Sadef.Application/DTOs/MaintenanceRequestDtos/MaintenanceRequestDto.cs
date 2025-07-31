using Sadef.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class MaintenanceRequestDto
    {
        public int Id { get; set; }
        public int LeadId { get; set; }
        public string? Description { get; set; }
        public string? AdminResponse { get; set; }
        public MaintenanceRequestStatus? Status { get; set; }
        public List<string>? ImageUrls { get; set; }
        public List<string>? VideoUrls { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool? IsActive { get; set; }
    }
}
