using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.NotificationDtos;
using Microsoft.AspNetCore.Authorization;

namespace Sadef.API.Controllers
{
    public class NotificationController : ApiBaseController
    {
        private readonly IFirebaseNotificationService _fcmService;

        public NotificationController(IFirebaseNotificationService fcmService)
        {
            _fcmService = fcmService;
        }

        [HttpPost("register-token")]
        public async Task<IActionResult> RegisterDeviceToken([FromBody] RegisterDeviceTokenDto dto)
        {
            var result = await _fcmService.RegisterDeviceToken(dto);
            return Ok(result);
        }

        [HttpPost("unregister-token")]
        public async Task<IActionResult> UnregisterDeviceToken([FromBody] UnregisterDeviceTokenDto dto)
        {
            var result = await _fcmService.UnregisterDeviceToken(dto);
            return Ok(result);
        }

        [HttpPost("send")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendNotification([FromBody] SendNotificationRequestDto request)
        {
            var result = await _fcmService.TestSendNotificationToMultipleAsync(request.Title, request.Body, request.UserId, request.Data);
            return Ok(result);
        }
    }
}
