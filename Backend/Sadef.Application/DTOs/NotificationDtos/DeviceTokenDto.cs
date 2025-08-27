namespace Sadef.Application.DTOs.NotificationDtos
{
    public class DeviceTokenDto
    {
        public string UserId { get; set; }
        public string DeviceToken { get; set; }
        public string? DeviceType { get; set; } // e.g., 'web', 'android', 'ios'
    }
}
