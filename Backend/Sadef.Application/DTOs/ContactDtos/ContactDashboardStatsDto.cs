using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.ContactDtos
{
    public class ContactDashboardStatsDto
    {
        public int TotalContacts { get; set; }
        public int NewContacts { get; set; }
        public int InProgressContacts { get; set; }
        public int CompletedContacts { get; set; }
        public int UrgentContacts { get; set; }
        public Dictionary<ContactType, int> ContactsByType { get; set; } = new();
        public Dictionary<ContactStatus, int> ContactsByStatus { get; set; } = new();
        public List<ContactDto> RecentContacts { get; set; } = new();
    }
} 