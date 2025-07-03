using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.Extensions;

namespace Sadef.API.Controllers
{
    public class NotificationController : ApiBaseController
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }
        [HttpGet("unread")]
        public async Task<IActionResult> GetUnread()
        {
            var userId = User.GetUserId(); // Extension or claim
            var result = await _notificationService.GetUnreadForUserAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> SendTestNotification()
        {
            var result = await _notificationService.SendTestNotification();
            return Ok(result);
        }
    }
}
