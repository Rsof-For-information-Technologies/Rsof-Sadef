using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.ContactDtos
{
    public class CreateContactDto
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public required string Subject { get; set; }
        public required string Message { get; set; }
        public ContactType Type { get; set; }
        public int? PropertyId { get; set; }
        public string? PreferredContactMethod { get; set; }
        public DateTime? PreferredContactTime { get; set; }
        public string? Budget { get; set; }
        public string? PropertyType { get; set; }
        public string? Location { get; set; }
        public bool IsUrgent { get; set; } = false;
      
    }
} 