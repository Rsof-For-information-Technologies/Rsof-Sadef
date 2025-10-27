using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Domain.NotificationEntity
{
    public class Notification
    {
        public required Guid UserId { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public bool? isReaded { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    }
}
