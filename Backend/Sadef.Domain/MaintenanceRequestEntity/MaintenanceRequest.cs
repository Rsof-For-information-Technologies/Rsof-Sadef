using Sadef.Common.Domain;
using Sadef.Domain.Constants;

namespace Sadef.Domain.MaintenanceRequestEntity
{
    public class MaintenanceRequest : AggregateRootBase
    {
        public int LeadId { get; set; }
        public string? Description { get; set; }
        public string? MediaUrl { get; set; }
        public MaintenanceRequestStatus? Status { get; set; }
        public string? AdminResponse { get; set; }
    }
}




