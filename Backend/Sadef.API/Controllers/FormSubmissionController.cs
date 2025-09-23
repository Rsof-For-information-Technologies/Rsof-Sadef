using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.FormSubmissionDtos;

namespace Sadef.API.Controllers
{
    public class FormSubmissionController : ApiBaseController
    {
        private readonly IFormSubmissionService _formSubmissionService;

        public FormSubmissionController(IFormSubmissionService formSubmissionService)
        {
            _formSubmissionService = formSubmissionService;
        }

        [HttpPost("submit-form")]
        public async Task<IActionResult> SubmitForm([FromForm] SubmitFormDto dto)
        {
            var result = await _formSubmissionService.SubmitFormAsync(dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await _formSubmissionService.GetPaginatedAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _formSubmissionService.GetByIdAsync(id);
            return Ok(result);
        }
    }
}
