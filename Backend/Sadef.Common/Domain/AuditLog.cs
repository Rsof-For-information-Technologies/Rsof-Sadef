using System;
using System.Text.Json;

namespace Sadef.Common.Domain
{
    public class AuditLog: AggregateRootBase
    {
        public string TableName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string KeyValues { get; set; } = string.Empty;
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public DateTime Timestamp { get; set; }
        public string? UserId { get; set; }
    }
}
