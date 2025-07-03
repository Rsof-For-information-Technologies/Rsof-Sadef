using Sadef.Common.Domain;

namespace Sadef.Domain.NotificationEntity
{
    public class Notification : AggregateRootBase
    {
        public required string UserId { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public bool IsRead { get; set; }
    }

}
