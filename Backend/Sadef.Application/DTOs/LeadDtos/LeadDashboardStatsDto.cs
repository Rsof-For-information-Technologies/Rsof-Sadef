using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LeadDtos
{
    public class LeadDashboardStatsDto
    {
        public int TotalLeads { get; set; }
        public int LeadsThisMonth { get; set; }
        public int ActiveLeads { get; set; }
        public int NewLeads { get; set; }
        public int Contacted { get; set; }
        public int InDiscussion { get; set; }
        public int VisitScheduled { get; set; }
        public int Converted { get; set; }
        public int Rejected { get; set; }
    }

}
