using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.FormSubmissionDtos;

namespace Sadef.API.Controllers
{
    public class EmailFormController : ApiBaseController
    {
        private readonly IEmailFormService _emailFormService;

        public EmailFormController(IEmailFormService emailFormService)
        {
            _emailFormService = emailFormService;
        }

        [HttpPost("send-form")]
        public async Task<IActionResult> SendForm([FromBody] EmailFormDto dto)
        {
            var result = await _emailFormService.SendEmailFormAsync(dto);
            
            if (!result.Succeeded)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
