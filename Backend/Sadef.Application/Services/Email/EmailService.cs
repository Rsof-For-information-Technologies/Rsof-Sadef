using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using System.Globalization;

namespace Sadef.Application.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly IStringLocalizer _emailLocalizer;

        public EmailService(IConfiguration config, IStringLocalizerFactory localizerFactory)
        {
            _config = config;
            _emailLocalizer = localizerFactory.Create("EmailTemplates", typeof(EmailService).Assembly.GetName().Name);
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpSettings = _config.GetSection("SmtpSettings");

            string smtpServer = smtpSettings["Server"];
            int smtpPort = int.Parse(smtpSettings["Port"]);
            string smtpUsername = smtpSettings["Username"];
            string smtpPassword = smtpSettings["Password"];
            bool enableSsl = bool.Parse(smtpSettings["EnableSSL"]);

            using (var smtpClient = new SmtpClient(smtpServer, smtpPort))
            {
                smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                smtpClient.EnableSsl = enableSsl;

                var mailMessage = new MailMessage(smtpUsername, toEmail, subject, body);
                mailMessage.IsBodyHtml = true;

                await smtpClient.SendMailAsync(mailMessage);
                return true;
            }

        }

        public async Task<bool> SendEmailAsync(string toEmail, string templateKey, object? templateData, string language = "en")
        {
            // Set culture for localization
            var culture = new CultureInfo(language);
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;

            // Get subject and body from resources
            var subject = _emailLocalizer[$"{templateKey}Subject"];
            var bodyTemplate = _emailLocalizer[$"{templateKey}Body"];
            string body = bodyTemplate;
            if (templateData != null)
            {
                // Simple string.Format for template data
                body = string.Format(bodyTemplate, templateData);
            }
            // Add RTL support for Arabic
            if (language.StartsWith("ar"))
            {
                if (!body.Contains("dir=\"rtl\""))
                {
                    body = $"<div dir=\"rtl\">{body}</div>";
                }
            }
            return await SendEmailAsync(toEmail, subject, body);
        }
    }

}
