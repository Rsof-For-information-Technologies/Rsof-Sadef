using Sadef.Application.DTOs.NotificationDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IFirebaseNotificationService
    {
        Task<Response<string>> UnregisterDeviceToken(UnregisterDeviceTokenDto dto);
        Task<Response<DeviceTokenDto>> RegisterDeviceToken(string UserID, string FcmToken, string DeviceType);
        Task SubscribeToTopicAsync(string token, string topic);
        Task<bool> SendLeadCreatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null);
        Task<bool> SendPropertyCreatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null);
        Task<bool> SendAdminMaintenanceRequestCreatedAsync(string title, string body, IDictionary<string, string>? data = null);
        Task<bool> SendNotificationToTopicAsync(string title, string body, string topic, IDictionary<string, string>? data = null);
        Task<bool> TestSendNotificationToMultipleAsync(string title, string body, string userId, IDictionary<string, string>? data = null);
        Task<bool> SendPropertyUpdatedNotificationToAdminAsync(string title, string body, IDictionary<string, string>? data = null);
        Task<bool> SendTestNotif(string title, string body);
    }
}
