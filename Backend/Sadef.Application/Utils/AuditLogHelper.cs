using Sadef.Application.DTOs.AuditLogDtos;
using Sadef.Common.Domain;

namespace Sadef.Application.Utils
{
    public class AuditLogHelper
    {
        public static IQueryable<AuditLog> ApplyFilters(IQueryable<AuditLog> query, AuditLogFilterDto filters)
        {
            if (!string.IsNullOrWhiteSpace(filters.TableName))
            {
                query = query.Where(x => x.TableName.Contains(filters.TableName));
            }

            if (!string.IsNullOrWhiteSpace(filters.Action))
            {
                query = query.Where(x => x.Action.Contains(filters.Action));
            }

            if (!string.IsNullOrWhiteSpace(filters.KeyValues))
            {
                query = query.Where(x => x.KeyValues.Contains(filters.KeyValues));
            }

            if (!string.IsNullOrWhiteSpace(filters.UserId))
            {
                query = query.Where(x => x.UserId == filters.UserId);
            }

            if (filters.FromDate.HasValue)
            {
                query = query.Where(x => x.Timestamp >= filters.FromDate.Value);
            }

            if (filters.ToDate.HasValue)
            {
                query = query.Where(x => x.Timestamp <= filters.ToDate.Value);
            }

            return query;
        }
    }
}
