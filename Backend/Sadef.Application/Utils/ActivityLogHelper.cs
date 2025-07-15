using Sadef.Application.DTOs.ActivityLogDtos;
using Sadef.Domain.ActivityLogEntity;

namespace Sadef.Application.Utils
{
    public static class ActivityLogHelper
    {
        public static IQueryable<ActivityLog> ApplyFilters(this IQueryable<ActivityLog> query, ActivityLogFilterDto filters)
        {
            if (!string.IsNullOrWhiteSpace(filters.UserId))
                query = query.Where(x => x.UserId == filters.UserId);

            if (!string.IsNullOrWhiteSpace(filters.UserEmail))
                query = query.Where(x => x.UserEmail != null && x.UserEmail.Contains(filters.UserEmail));

            if (!string.IsNullOrWhiteSpace(filters.Category))
                query = query.Where(x => x.Category == filters.Category);

            if (!string.IsNullOrWhiteSpace(filters.Action))
                query = query.Where(x => x.Action != null && x.Action.Contains(filters.Action));

            if (!string.IsNullOrWhiteSpace(filters.EntityType))
                query = query.Where(x => x.EntityType == filters.EntityType);

            if (filters.EntityId.HasValue)
                query = query.Where(x => x.EntityId == filters.EntityId);

            if (filters.IsSuccess.HasValue)
                query = query.Where(x => x.IsSuccess == filters.IsSuccess);

            if (filters.FromDateUtc.HasValue)
                query = query.Where(x => x.CreatedAt >= filters.FromDateUtc.Value);

            if (filters.ToDateUtc.HasValue)
                query = query.Where(x => x.CreatedAt <= filters.ToDateUtc.Value);

            return query;
        }
    }
}
