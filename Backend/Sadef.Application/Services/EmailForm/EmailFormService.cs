using FluentValidation;
using Microsoft.Extensions.Localization;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.FormSubmissionDtos;
using Sadef.Application.Services.Email;
using Sadef.Common.Infrastructure.Wrappers;

namespace Sadef.Application.Services.EmailForm
{
    public class EmailFormService : IEmailFormService
    {
        private readonly IEmailService _emailService;
        private readonly IStringLocalizer _localizer;

        public EmailFormService(
            IEmailService emailService,
            IStringLocalizerFactory localizerFactory)
        {
            _emailService = emailService;
            _localizer = localizerFactory.Create("Messages", "Sadef.Application");
        }

        public async Task<Response<bool>> SendEmailFormAsync(EmailFormDto dto)
        {
           

            try
            {
                // Subject can just be a fixed line
                var emailSubject = $"New Form Submission from {dto.Name}";

                var emailBody = CreateEmailBody(dto);

                // Send email
                var emailSent = await _emailService.SendEmailAsync(
                    "k.khammash@rsof.com.sa",
                    emailSubject,
                    emailBody
                );

                if (!emailSent)
                {
                    return new Response<bool>
                    {
                        Succeeded = false,
                        Message = _localizer["Email_SendFailed"] ?? "Failed to send email"
                    };
                }

                return new Response<bool>(
                    true,
                    _localizer["Email_SentSuccessfully"] ?? "Email sent successfully"
                );
            }
            catch (Exception ex)
            {
                return new Response<bool>
                {
                    Succeeded = false,
                    Message = $"Error sending email: {ex.Message}"
                };
            }
        }

        private string CreateEmailBody(EmailFormDto dto)
        {
            var body = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; 
                            padding: 20px; border: 1px solid #ddd; border-radius: 8px;'>
                    <h2 style='color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;'>
                        New Form Submission
                    </h2>

                    <div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;'>
                        <h3 style='color: #495057; margin-top: 0;'>Contact Information</h3>
                        <p><strong>Name:</strong> {dto.Name}</p>
                        <p><strong>Email:</strong> {dto.Email}</p>
                    </div>

                    {(!string.IsNullOrEmpty(dto.ProjectRequirement) ? $@"
                    <div style='background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;'>
                        <h3 style='color: #856404; margin-top: 0;'>Project Requirement</h3>
                        <p style='white-space: pre-wrap;'>{dto.ProjectRequirement}</p>
                    </div>" : "")}

                    <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; 
                                color: #6c757d; font-size: 12px;'>
                        <p>This email was automatically generated from a form submission on the website.</p>
                        <p>Submitted on: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</p>
                    </div>
                </div>";

            return body;
        }
    }
}
