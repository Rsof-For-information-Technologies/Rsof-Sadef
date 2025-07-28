using Microsoft.AspNetCore.Mvc;
using Sadef.Application.DTOs.WhtsappLink;

namespace Sadef.API.Controllers
{
    public class ConfigController : ApiBaseController
    {
        private readonly IConfiguration _configuration;

        public ConfigController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("whatsapp-link")]
        public IActionResult GetWhatsappLink()
        {
            var link = _configuration["Whatsapp:Link"];

            if (string.IsNullOrWhiteSpace(link))
                return NotFound("WhatsApp link is not configured.");

            return Ok(new WhatsappLinkDto { Link = link });
        }
    }

}
