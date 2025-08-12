namespace Sadef.Application.DTOs.ContactDtos
{
    public class ContactTranslationDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? PreferredContactMethod { get; set; }
        public string? Location { get; set; }
    }
} 