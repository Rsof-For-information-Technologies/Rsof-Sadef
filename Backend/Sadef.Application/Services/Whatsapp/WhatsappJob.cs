using Quartz;
using Sadef.Application.Services.Whatsapp;
using Sadef.Domain.Users;

public class WhatsappJob : IJob
{
    private readonly IWhatsappService _whatsappService;

    public WhatsappJob(IWhatsappService whatsappService)
    {
        _whatsappService = whatsappService;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        var userJson = context.JobDetail.JobDataMap.GetString("user");
        var phoneNumber = context.JobDetail.JobDataMap.GetString("phone");
        var time = context.JobDetail.JobDataMap.GetString("time");

        if (!string.IsNullOrEmpty(userJson) && !string.IsNullOrEmpty(phoneNumber))
        {
            var user = System.Text.Json.JsonSerializer.Deserialize<UserInfo>(userJson);
            await _whatsappService.RequestLocationAsync(phoneNumber, user , time);
        }
    }
}
