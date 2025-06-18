using Sadef.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class UpdateMaintenanceRequestStatusDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string? AdminResponse { get; set; }
        public MaintenanceRequestStatus Status { get; set; }
    }
}
