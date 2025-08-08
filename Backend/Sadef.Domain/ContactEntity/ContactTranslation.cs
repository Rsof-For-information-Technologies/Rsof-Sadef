using Sadef.Common.Domain;

namespace Sadef.Domain.ContactEntity
{
    public class ContactTranslation : EntityBase
    {
        public int ContactId { get; set; }
        public string LanguageCode { get; set; } = "en";
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? PreferredContactMethod { get; set; }
        public string? Location { get; set; }
        public Contact Contact { get; set; } = null!;
    }
} 