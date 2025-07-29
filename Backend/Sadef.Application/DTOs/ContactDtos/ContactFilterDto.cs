using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.ContactDtos
{
    public class ContactFilterDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Subject { get; set; }
        public ContactType? Type { get; set; }
        public ContactStatus? Status { get; set; }
        public int? PropertyId { get; set; }
        public bool? IsUrgent { get; set; }
        public DateTime? CreatedAtFrom { get; set; }
        public DateTime? CreatedAtTo { get; set; }
    }
} 