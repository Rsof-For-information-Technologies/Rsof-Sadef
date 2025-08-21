using Sadef.Common.Domain;
using Sadef.Domain.Constants;

namespace Sadef.Domain.PropertyEntity
{
    public class PropertyTimeLine : AggregateRootBase
    {
        public required int PropertyId { get; set; }
        public PropertyStatus Status { get; set; }
        public required string ActionTaken { get; set; }
        public required string ActionTakenBy { get; set; }
        public DateTime Timestamp { get; set; }
    }
}