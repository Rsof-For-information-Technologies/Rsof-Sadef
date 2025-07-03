using Microsoft.AspNetCore.Mvc;
using Sadef.Application.DTOs.NotificationDtos;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface INotificationService
    {
        Task CreateAndDispatchAsync(string title, string message, List<Guid> userIds);
        Task<List<NotificationDto>> GetUnreadForUserAsync(string userId);
        Task MarkAsReadAsync(int notificationId, string userId);
        Task<IActionResult> SendTestNotification();
    }
}
