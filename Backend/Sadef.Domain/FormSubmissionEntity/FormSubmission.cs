using Sadef.Common.Domain;

namespace Sadef.Domain.FormSubmissionEntity
{
    public class FormSubmission : AggregateRootBase
    {
        public required string Name { get; set; }
        public required string MobileNumber { get; set; }
        public required string Email { get; set; }
        public string? CVUrl { get; set; }
        public required string MemberType { get; set; }

    }
}
