using System.ComponentModel.DataAnnotations;

namespace Sadef.Application.DTOs.FormSubmissionDtos
{
    public class EmailFormDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public required string Email { get; set; }


        [StringLength(500, ErrorMessage = "Project requirement cannot exceed 500 characters")]
        public string? ProjectRequirement { get; set; }

    }
}
