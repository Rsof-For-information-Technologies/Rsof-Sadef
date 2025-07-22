using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.NotificationDtos
{
    public class UnregisterDeviceTokenDto
    {
        public required string UserId { get; set; }
        public required string DeviceToken { get; set; }
        public string? DeviceType { get; set; } // e.g., 'web', 'android', 'ios'
    }
}
