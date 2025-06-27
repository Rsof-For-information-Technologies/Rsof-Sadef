using Sadef.Application.DTOs.MaintenanceRequestDtos;
using Sadef.Domain.Constants;
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

        public static bool IsValidStatusTransition(MaintenanceRequestStatus currentStatus, MaintenanceRequestStatus newStatus, out string? errorMessage)
        {
            var allowedTransitions = new Dictionary<MaintenanceRequestStatus, MaintenanceRequestStatus[]>
            {
                { MaintenanceRequestStatus.Pending,    new[] { MaintenanceRequestStatus.InProgress, MaintenanceRequestStatus.Rejected } },
                { MaintenanceRequestStatus.InProgress, new[] { MaintenanceRequestStatus.Resolved, MaintenanceRequestStatus.Rejected } },
                { MaintenanceRequestStatus.Resolved,   Array.Empty<MaintenanceRequestStatus>() },
                { MaintenanceRequestStatus.Rejected,   Array.Empty<MaintenanceRequestStatus>() }
            };

            if (!allowedTransitions.TryGetValue(currentStatus, out var validNextStatuses))
            {
                errorMessage = $"Current status '{currentStatus}' is not recognized.";
                return false;
            }

            if (!validNextStatuses.Contains(newStatus))
            {
                errorMessage = $"Invalid status transition from {currentStatus} to {newStatus}.";
                return false;
            }

            errorMessage = null;
            return true;
        }
    }
}
