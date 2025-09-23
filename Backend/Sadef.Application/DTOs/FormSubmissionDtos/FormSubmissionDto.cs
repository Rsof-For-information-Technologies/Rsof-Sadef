namespace Sadef.Application.DTOs.FormSubmissionDtos
{
    public class FormSubmissionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? CVUrl { get; set; }
        public string VisitorOrMember { get; set; } = string.Empty;
        public string CurrentOrganization { get; set; } = string.Empty;
        public string? PreviousProjects { get; set; }
        public string? PastSpeakingExperience { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
    }
}
