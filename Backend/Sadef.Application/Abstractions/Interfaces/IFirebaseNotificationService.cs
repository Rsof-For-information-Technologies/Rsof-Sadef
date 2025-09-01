using Sadef.Application.DTOs.NotificationDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Abstractions.Interfaces
{
    public interface IFirebaseNotificationService
    {
        Task<bool> SendNotificationAsync(string title, string body, string deviceToken, IDictionary<string, string>? data = null);
        Task<bool> SendNotificationToMultipleAsync(string title, string body, List<string> deviceTokens, IDictionary<string, string>? data = null);
        Task<bool> SendNotificationToTopicAsync(string title, string body, string topic, IDictionary<string, string>? data = null);
        Task<Response<DeviceTokenDto>> RegisterDeviceToken(string UserID, string FcmToken, string DeviceType);
        Task<Response<string>> UnregisterDeviceToken(UnregisterDeviceTokenDto dto);
        Task SendLeadCreatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null);
        Task<bool> TestSendNotificationToMultipleAsync(string title, string body, string userId, IDictionary<string, string>? data = null);
    }
}
