using Sadef.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class MaintenanceRequestFilterDto
    {
        public int? LeadId { get; set; }
        public MaintenanceRequestStatus Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

}
