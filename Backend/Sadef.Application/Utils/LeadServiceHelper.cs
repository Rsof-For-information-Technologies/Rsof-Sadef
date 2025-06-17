using Sadef.Application.DTOs.LeadDtos;
using Sadef.Domain.LeadEntity;
using System;
using System.Linq;

namespace Sadef.Application.Utils
{
    public static class LeadServiceHelper
    {
        public static IQueryable<Lead> ApplyFilters(IQueryable<Lead> query, LeadFilterDto filters)
        {
            if (!string.IsNullOrWhiteSpace(filters.FullName))
                query = query.Where(x => x.FullName.Contains(filters.FullName));

            if (!string.IsNullOrWhiteSpace(filters.Email))
                query = query.Where(x => x.Email.Contains(filters.Email));

            if (!string.IsNullOrWhiteSpace(filters.Phone))
                query = query.Where(x => x.Phone == filters.Phone);

            if (filters.PropertyId.HasValue)
                query = query.Where(x => x.PropertyId == filters.PropertyId);

            if (filters.Status.HasValue)
                query = query.Where(x => x.Status == filters.Status.Value);

            if (filters.CreatedAtFrom.HasValue)
                query = query.Where(x => x.CreatedAt >= filters.CreatedAtFrom.Value);

            if (filters.CreatedAtTo.HasValue)
                query = query.Where(x => x.CreatedAt <= filters.CreatedAtTo.Value);

            return query;
        }

        public static string BuildCacheKey(string version, int pageNumber, int pageSize, LeadFilterDto filters)
        {
            return $"leads:version={version}:page={pageNumber}&size={pageSize}" +
                   $"&name={filters.FullName}" +
                   $"&email={filters.Email}" +
                   $"&phone={filters.Phone}" +
                   $"&prop={filters.PropertyId}" +
                   $"&status={filters.Status}" +
                   $"&from={filters.CreatedAtFrom?.ToString("yyyyMMdd")}" +
                   $"&to={filters.CreatedAtTo?.ToString("yyyyMMdd")}";
        }
    }
}
