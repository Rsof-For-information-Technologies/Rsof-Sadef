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
        public required string MemberType { get; set; }
    }
}
