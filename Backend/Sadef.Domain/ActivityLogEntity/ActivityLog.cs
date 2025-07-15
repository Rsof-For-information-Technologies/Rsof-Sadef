using Sadef.Common.Domain;

namespace Sadef.Domain.ActivityLogEntity
{
    public class ActivityLog : AggregateRootBase
    {
        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? Category { get; set; }
        public string? Action { get; set; }
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public string? IPAddress { get; set; }
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
