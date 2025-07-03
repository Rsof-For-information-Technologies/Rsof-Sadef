using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.NotificationDtos
{
    public class CreateNotificationDto
    {
        public required string UserId { get; set; }
        public required string Title { get; set; }
        public required string Message { get; set; }
    }
}
