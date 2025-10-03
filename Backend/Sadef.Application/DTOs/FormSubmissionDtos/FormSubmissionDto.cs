namespace Sadef.Application.DTOs.FormSubmissionDtos
{
    public class FormSubmissionDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? CVUrl { get; set; }
        public string MemberType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
