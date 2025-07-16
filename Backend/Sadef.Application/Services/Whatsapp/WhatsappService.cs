using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Domain.Users;

namespace Sadef.Application.Services.Whatsapp
{
    public class WhatsappService : IWhatsappService
    {
        private readonly HttpClient _httpClient;
        private const string TelinfyUrl = "https://api.telinfy.net/gagp/whatsapp/templates/message";
        private const string ApiKey = "21dadf4a-0a27-4c4d-afe7-9708f9fb4e20";

        public WhatsappService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task RequestLocationAsync(string mobileNumber, UserInfo user , string time)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, TelinfyUrl);

            request.Headers.Add("Authorization", "Bearer access_token");
            request.Headers.Add("API-Key", ApiKey);
            request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            var messageBody = new
            {
                to = mobileNumber,
                templateName = "lucid_reminder",
                language = "en_GB",
                header = new
                {
                    parameters = new[]
                    {
                new { type = "text", text = user.Name },
                new { type = "text", text = time },
                new { type = "text", text = user.Email}
            }
                },
                body = (object)null,
                button = (object)null
            };
            request.Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(messageBody), System.Text.Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to send WhatsApp message: {response.StatusCode} - {responseContent}");
            }
            else
            {
                System.Diagnostics.Debug.WriteLine("Telinfy Response: " + responseContent);
            }

        }

    }
}
