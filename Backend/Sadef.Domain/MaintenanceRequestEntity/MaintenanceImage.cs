using Sadef.Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Domain.MaintenanceRequestEntity
{
    public class MaintenanceImage : AggregateRootBase
    {
        public string ImageUrl { get; set; }
        public string ContentType { get; set; }
        public int MaintenanceRequestId { get; set; }
        public MaintenanceRequest MaintenanceRequest { get; set; }
    }
}
