using Microsoft.Extensions.Caching.Distributed;
using OfficeOpenXml;
using Sadef.Application.DTOs.LeadDtos;
using Sadef.Domain.LeadEntity;

namespace Sadef.Application.Utils
{
    public static class LeadServiceHelper
    {
        private const string VersionKey = "leads:version";

        public static async Task<string> GetVersionAsync(IDistributedCache cache)
        {
            var version = await cache.GetStringAsync(VersionKey);
            if (string.IsNullOrEmpty(version))
            {
                version = "v1";
                await cache.SetStringAsync(VersionKey, version);
            }
            return version;
        }

        public static Task InvalidateAsync(IDistributedCache cache)
        {
            return cache.SetStringAsync(VersionKey, Guid.NewGuid().ToString());
        }

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

        public static async Task<string> GenerateFilteredLeadCacheKey(IDistributedCache cache, int page, int size, LeadFilterDto filters)
        {
            var version = await GetVersionAsync(cache);

            var key = $"filteredLeads:{version}:page={page}&size={size}";

            if (!string.IsNullOrWhiteSpace(filters.FullName)) key += $"&name={filters.FullName}";
            if (!string.IsNullOrWhiteSpace(filters.Email)) key += $"&email={filters.Email}";
            if (!string.IsNullOrWhiteSpace(filters.Phone)) key += $"&phone={filters.Phone}";
            if (filters.PropertyId.HasValue) key += $"&propId={filters.PropertyId}";
            if (filters.Status.HasValue) key += $"&status={filters.Status}";
            if (filters.CreatedAtFrom.HasValue) key += $"&from={filters.CreatedAtFrom.Value:yyyyMMdd}";
            if (filters.CreatedAtTo.HasValue) key += $"&to={filters.CreatedAtTo.Value:yyyyMMdd}";

            return key;
        }

        public static byte[] GenerateExcelReport(List<LeadDto> leads)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Leads");

            // Header row
            worksheet.Cells[1, 1].Value = "ID";
            worksheet.Cells[1, 2].Value = "Full Name";
            worksheet.Cells[1, 3].Value = "Email";
            worksheet.Cells[1, 4].Value = "Phone";
            worksheet.Cells[1, 5].Value = "Message";
            worksheet.Cells[1, 6].Value = "Property ID";
            worksheet.Cells[1, 7].Value = "Status";

            for (int i = 0; i < leads.Count; i++)
            {
                var lead = leads[i];
                worksheet.Cells[i + 2, 1].Value = lead.Id;
                worksheet.Cells[i + 2, 2].Value = lead.FullName;
                worksheet.Cells[i + 2, 3].Value = lead.Email;
                worksheet.Cells[i + 2, 4].Value = lead.Phone;
                worksheet.Cells[i + 2, 5].Value = lead.Message;
                worksheet.Cells[i + 2, 6].Value = lead.PropertyId;
                worksheet.Cells[i + 2, 7].Value = lead.status?.ToString();
            }

            if (OperatingSystem.IsWindows() && worksheet.Dimension != null)
            {
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
            }

            return package.GetAsByteArray();
        }
    }
}
