using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.PropertyDtos
{
    public class PropertyDashboardStatsDto
    {
        public int TotalProperties { get; set; }
        public int ActiveProperties { get; set; }
        public int ExpiredProperties { get; set; }
        public int PendingCount { get; set; }
        public int ApprovedCount { get; set; }
        public int SoldCount { get; set; }
        public int RejectedCount { get; set; }
        public int ArchivedCount { get; set; }
        public int ListedThisWeek { get; set; }
        public decimal? TotalExpectedAnnualRent { get; set; }
        public decimal? TotalProjectedResaleValue { get; set; }
        public int PropertiesWithInvestmentData { get; set; }
        public Dictionary<string, int> UnitCategoryCounts { get; set; } = new();
        //public int activeProperties { get; set; }

    }

}
