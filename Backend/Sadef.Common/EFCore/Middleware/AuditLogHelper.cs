using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Sadef.Common.Domain;
using System.Text.Json;

namespace Sadef.Common.EFCore.Middleware
{
    public static class AuditLogHelper
    {
        public static List<AuditLog> CreateAuditLogs(DbContext context, string? userId)
        {
            var auditEntries = new List<AuditLog>();
            foreach (var entry in context.ChangeTracker.Entries())
            {
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                var auditLog = new AuditLog
                {
                    TableName = entry.Metadata.GetTableName() ?? entry.Entity.GetType().Name,
                    Timestamp = DateTime.UtcNow,
                    UserId = userId,
                };

                // Get primary key(s)
                var keyNames = entry.Properties.Where(p => p.Metadata.IsPrimaryKey()).Select(p => p.Metadata.Name).ToList();
                var keyValues = new Dictionary<string, object?>();
                foreach (var keyName in keyNames)
                {
                    keyValues[keyName] = entry.Property(keyName).CurrentValue;
                }
                auditLog.KeyValues = JsonSerializer.Serialize(keyValues);

                switch (entry.State)
                {
                    case EntityState.Added:
                        auditLog.Action = "Created";
                        auditLog.OldValues = null;
                        auditLog.NewValues = JsonSerializer.Serialize(GetPropertyValues(entry.CurrentValues));
                        break;
                    case EntityState.Modified:
                        auditLog.Action = "Updated";
                        auditLog.OldValues = JsonSerializer.Serialize(GetPropertyValues(entry.OriginalValues));
                        auditLog.NewValues = JsonSerializer.Serialize(GetPropertyValues(entry.CurrentValues));
                        break;
                    case EntityState.Deleted:
                        auditLog.Action = "Delete";
                        auditLog.OldValues = JsonSerializer.Serialize(GetPropertyValues(entry.OriginalValues));
                        auditLog.NewValues = null;
                        break;
                }
                auditEntries.Add(auditLog);
            }
            return auditEntries;
        }

        public static Dictionary<string, object?> GetPropertyValues(PropertyValues values)
        {
            var dict = new Dictionary<string, object?>();
            foreach (var property in values.Properties)
            {
                dict[property.Name] = values[property];
            }
            return dict;
        }
    }
} 