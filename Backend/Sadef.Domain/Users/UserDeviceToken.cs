using Sadef.Common.Domain;

namespace Sadef.Domain.Users
{
    public class UserDeviceToken : AggregateRootBase
    {
        public string UserId { get; set; }
        public string DeviceToken { get; set; }
        public string? DeviceType { get; set; } // e.g., 'web', 'android', 'ios'
    }
}
