using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace Sadef.Application.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
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
    }

}
