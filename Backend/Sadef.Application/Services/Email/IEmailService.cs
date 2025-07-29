namespace Sadef.Application.Services.Email
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string body);
        Task<bool> SendEmailAsync(string toEmail, string templateKey, object? templateData, string language = "en");
    }
}
