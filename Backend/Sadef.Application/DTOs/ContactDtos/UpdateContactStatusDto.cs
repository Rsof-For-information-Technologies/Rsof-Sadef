using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.ContactDtos
{
    public class UpdateContactStatusDto
    {
        public int Id { get; set; }
        public ContactStatus Status { get; set; }
        public string? Notes { get; set; }
    }
} 