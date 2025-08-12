using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.ContactDtos;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.API.Controllers
{
    public class ContactController : ApiBaseController
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateContact([FromForm] CreateContactDto dto)
        {
            var result = await _contactService.CreateContactAsync(dto);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] ContactFilterDto filters,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool isExport = false)
        {
            var result = await _contactService.GetPaginatedAsync(pageNumber, pageSize, filters, isExport);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _contactService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateContact([FromForm] UpdateContactDto dto)
        {
            var result = await _contactService.UpdateContactAsync(dto);
            return Ok(result);
        }

        [HttpPatch("update-status")]
        public async Task<ActionResult<Response<string>>> ChangeStatus([FromBody] UpdateContactStatusDto dto)
        {
            var result = await _contactService.ChangeStatusAsync(dto);
            return Ok(result);
        }

        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetContactStats()
        {
            var result = await _contactService.GetContactDashboardStatsAsync();
            return Ok(result);
        }

        [HttpGet("by-property/{propertyId}")]
        public async Task<IActionResult> GetContactsByProperty(int propertyId)
        {
            var result = await _contactService.GetContactsByPropertyAsync(propertyId);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Response<string>>> DeleteContact(int id)
        {
            var result = await _contactService.DeleteContactAsync(id);
            return Ok(result);
        }

        [HttpGet("urgent")]
        public async Task<IActionResult> GetUrgentContacts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var filters = new ContactFilterDto { IsUrgent = true };
            var result = await _contactService.GetPaginatedAsync(pageNumber, pageSize, filters, false);
            return Ok(result);
        }

        [HttpGet("new")]
        public async Task<IActionResult> GetNewContacts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var filters = new ContactFilterDto { Status = Sadef.Domain.Constants.ContactStatus.New };
            var result = await _contactService.GetPaginatedAsync(pageNumber, pageSize, filters, false);
            return Ok(result);
        }
    }
}