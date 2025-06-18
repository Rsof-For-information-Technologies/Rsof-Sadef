using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Domain.MaintenanceRequestEntity;

namespace Sadef.Application.Utils
{
    public static class MaintenanceRequestHelper
    {
        public static IQueryable<MaintenanceRequest> ApplyFilters(IQueryable<MaintenanceRequest> query, MaintenanceRequestFilterDto filters)
        {
            if (filters.LeadId.HasValue)
                query = query.Where(x => x.LeadId == filters.LeadId);

            if (filters.Status != default)
                query = query.Where(x => x.Status == filters.Status);

            if (filters.FromDate.HasValue)
                query = query.Where(x => x.CreatedAt >= filters.FromDate.Value);

            if (filters.ToDate.HasValue)
                query = query.Where(x => x.CreatedAt <= filters.ToDate.Value);

            return query;
        }
    }
}
