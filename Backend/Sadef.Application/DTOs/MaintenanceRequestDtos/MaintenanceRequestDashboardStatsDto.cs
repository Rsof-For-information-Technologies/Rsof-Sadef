using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class MaintenanceRequestDashboardStatsDto
    {
        public int TotalRequests { get; set; }
        public int RequestsThisMonth { get; set; }
        public int Pending { get; set; }
        public int InProgress { get; set; }
        public int Resolved { get; set; }
        public int Rejected { get; set; }
    }
}
