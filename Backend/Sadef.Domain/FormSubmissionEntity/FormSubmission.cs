using Sadef.Common.Domain;

namespace Sadef.Domain.FormSubmissionEntity
{
    public class FormSubmission : AggregateRootBase
    {
        public required string Name { get; set; }
        public required string MobileNumber { get; set; }
        public required string Email { get; set; }
        public string? CVUrl { get; set; }
        public required string VisitorOrMember { get; set; }
        public required string CurrentOrganization { get; set; }
        public string? PreviousProjects { get; set; }
        public string? PastSpeakingExperience { get; set; }
    }
}
