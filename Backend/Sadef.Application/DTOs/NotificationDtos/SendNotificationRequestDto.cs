using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.NotificationDtos
{
    public class SendNotificationRequestDto
    {
        public string? UserId { get; set; }
        public string? Title { get; set; }
        public string? Body { get; set; }
        public Dictionary<string, string>? Data { get; set; }
    }
}