using Sadef.Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Domain.MaintenanceRequestEntity
{
    public class MaintenanceVideo : AggregateRootBase
    {
        public byte[] VideoData { get; set; }
        public string ContentType { get; set; }
        public int MaintenanceRequestId { get; set; }
        public MaintenanceRequest MaintenanceRequest { get; set; }
    }
}
