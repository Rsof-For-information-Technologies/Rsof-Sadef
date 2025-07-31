using Microsoft.AspNetCore.Http;
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
        public static async Task<List<MaintenanceImage>> SaveImagesAsync(IEnumerable<IFormFile> images, string uploadRoot, int requestId)
        {
            var imageList = new List<MaintenanceImage>();
            Directory.CreateDirectory(uploadRoot);

            foreach (var file in images)
            {
                var extension = Path.GetExtension(file.FileName);
                var fileName = $"img_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadRoot, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                imageList.Add(new MaintenanceImage
                {
                    ContentType = file.ContentType,
                    ImageUrl = $"/uploads/maintenance/{requestId}/{fileName}"
                });
            }

            return imageList;
        }

        public static async Task<List<MaintenanceVideo>> SaveVideosAsync(IEnumerable<IFormFile> videos, string uploadRoot, int requestId)
        {
            var videoList = new List<MaintenanceVideo>();
            Directory.CreateDirectory(uploadRoot);

            foreach (var file in videos)
            {
                var extension = Path.GetExtension(file.FileName);
                var fileName = $"vid_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadRoot, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream);

                videoList.Add(new MaintenanceVideo
                {
                    ContentType = file.ContentType,
                    VideoUrl = $"/uploads/maintenance/{requestId}/{fileName}"
                });
            }

            return videoList;
        }

        public static void DeleteFiles(IEnumerable<string> relativePaths)
        {
            foreach (var path in relativePaths)
            {
                var fullPath = Path.Combine("wwwroot", path.TrimStart('/'));
                if (File.Exists(fullPath))
                    File.Delete(fullPath);
            }
        }
    }
}
