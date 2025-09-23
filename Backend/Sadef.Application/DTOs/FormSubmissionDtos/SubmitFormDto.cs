using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Sadef.Application.DTOs.FormSubmissionDtos
{
    public class SubmitFormDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [StringLength(20, ErrorMessage = "Mobile number cannot exceed 20 characters")]
        public required string MobileNumber { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public required string Email { get; set; }

        public IFormFile? CV { get; set; }

        [Required(ErrorMessage = "Visitor or Member status is required")]
        [RegularExpression("^(Visitor|Member)$", ErrorMessage = "VisitorOrMember must be either 'Visitor' or 'Member'")]
        public required string VisitorOrMember { get; set; }

        [Required(ErrorMessage = "Current organization is required")]
        [StringLength(200, ErrorMessage = "Current organization cannot exceed 200 characters")]
        public required string CurrentOrganization { get; set; }

        [StringLength(1000, ErrorMessage = "Previous projects cannot exceed 1000 characters")]
        public string? PreviousProjects { get; set; }

        [StringLength(1000, ErrorMessage = "Past speaking experience cannot exceed 1000 characters")]
        public string? PastSpeakingExperience { get; set; }
    }
}
