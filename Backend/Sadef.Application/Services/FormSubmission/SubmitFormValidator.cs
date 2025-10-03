//using FluentValidation;
//using Microsoft.AspNetCore.Http;
//using Sadef.Application.DTOs.FormSubmissionDtos;

//namespace Sadef.Application.Services.FormSubmission
//{
//    public class SubmitFormValidator : AbstractValidator<SubmitFormDto>
//    {
//        public SubmitFormValidator()
//        {
//            RuleFor(x => x.Name)
//                .NotEmpty().WithMessage("Name is required")
//                .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

//            RuleFor(x => x.MobileNumber)
//                .NotEmpty().WithMessage("Mobile number is required")
//                .MaximumLength(20).WithMessage("Mobile number cannot exceed 20 characters");

//            RuleFor(x => x.Email)
//                .NotEmpty().WithMessage("Email is required")
//                .EmailAddress().WithMessage("Invalid email format")
//                .MaximumLength(100).WithMessage("Email cannot exceed 100 characters");

//            RuleFor(x => x.VisitorOrMember)
//                .NotEmpty().WithMessage("Visitor or Member status is required")
//                .Must(x => x == "Visitor" || x == "Member").WithMessage("VisitorOrMember must be either 'Visitor' or 'Member'");

//            RuleFor(x => x.CurrentOrganization)
//                .NotEmpty().WithMessage("Current organization is required")
//                .MaximumLength(200).WithMessage("Current organization cannot exceed 200 characters");

//            RuleFor(x => x.PreviousProjects)
//                .MaximumLength(1000).WithMessage("Previous projects cannot exceed 1000 characters")
//                .When(x => !string.IsNullOrEmpty(x.PreviousProjects));

//            RuleFor(x => x.PastSpeakingExperience)
//                .MaximumLength(1000).WithMessage("Past speaking experience cannot exceed 1000 characters")
//                .When(x => !string.IsNullOrEmpty(x.PastSpeakingExperience));

//            RuleFor(x => x.CV)
//                .Must(BeValidFileType).WithMessage("CV must be a valid file type (PDF, DOC, DOCX)")
//                .Must(BeValidFileSize).WithMessage("CV file size cannot exceed 10MB")
//                .When(x => x.CV != null);
//        }

//        private bool BeValidFileType(IFormFile? file)
//        {
//            if (file == null) return true;

//            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
//            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
//            return allowedExtensions.Contains(extension);
//        }

//        private bool BeValidFileSize(IFormFile? file)
//        {
//            if (file == null) return true;

//            const long maxSize = 10 * 1024 * 1024; // 10MB
//            return file.Length <= maxSize;
//        }
//    }
//}

using FluentValidation;
using Microsoft.AspNetCore.Http;
using Sadef.Application.DTOs.FormSubmissionDtos;

namespace Sadef.Application.Services.FormSubmission
{
    public class SubmitFormValidator : AbstractValidator<SubmitFormDto>
    {
        public SubmitFormValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("الاسم مطلوب")
                .MaximumLength(100).WithMessage("الاسم لا يمكن أن يتجاوز 100 حرف");

            RuleFor(x => x.MobileNumber)
                .NotEmpty().WithMessage("رقم الجوال مطلوب")
                .MaximumLength(20).WithMessage("رقم الجوال لا يمكن أن يتجاوز 20 خانة");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("البريد الإلكتروني مطلوب")
                .EmailAddress().WithMessage("صيغة البريد الإلكتروني غير صحيحة")
                .MaximumLength(100).WithMessage("البريد الإلكتروني لا يمكن أن يتجاوز 100 خانة");

            RuleFor(x => x.CV)
                .Must(BeValidFileType).WithMessage("يجب أن يكون الملف بتنسيق صحيح (PDF, DOC, DOCX)")
                .Must(BeValidFileSize).WithMessage("حجم الملف لا يمكن أن يتجاوز 10 ميجابايت")
                .When(x => x.CV != null);
        }

        private bool BeValidFileType(IFormFile? file)
        {
            if (file == null) return true;

            var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return allowedExtensions.Contains(extension);
        }

        private bool BeValidFileSize(IFormFile? file)
        {
            if (file == null) return true;

            const long maxSize = 10 * 1024 * 1024; // 10MB
            return file.Length <= maxSize;
        }
    }
}

