using Sadef.Common.Domain;
using Sadef.Domain.Constants;
using Sadef.Domain.PropertyEntity;

namespace Sadef.Domain.MaintenanceRequestEntity
{
    public class MaintenanceRequest : AggregateRootBase
    {
        public int LeadId { get; set; }
        public string? Description { get; set; }
        public ICollection<MaintenanceImage>? Images { get; set; }
        public ICollection<MaintenanceVideo>? Videos { get; set; }
        public MaintenanceRequestStatus? Status { get; set; }
        public string? AdminResponse { get; set; }
    }
}




