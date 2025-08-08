using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.ContactDtos
{
    public class UpdateContactDto
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public ContactType? Type { get; set; }
        public ContactStatus? Status { get; set; }
        public int? PropertyId { get; set; }
        public DateTime? PreferredContactTime { get; set; }
        public string? Budget { get; set; }
        public string? PropertyType { get; set; }
        public bool? IsUrgent { get; set; }
        
        // Translation support
        public Dictionary<string, ContactTranslationDto>? Translations { get; set; }
    }
} 