using AutoMapper;
using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Identity;
using Sadef.Common.Infrastructure.EFCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.NotificationDtos;
using Sadef.Application.Utils;
using Sadef.Common.Domain;
using Sadef.Common.Infrastructure.Wrappers;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Sadef.Application.Services.Notification
{
    public class FirebaseNotificationService : IFirebaseNotificationService
    {
        private readonly IMapper _mapper;
        private readonly string _projectId;
        private readonly IUnitOfWorkAsync _uow;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;


        public FirebaseNotificationService(IConfiguration config, IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, UserManager<ApplicationUser> userManager)
        {
            _uow = uow;
            _mapper = mapper;
            _config = config;
            _httpClient = new HttpClient();
            _projectId = _config["Firebase:ProjectId"];
            _userManager = userManager;
            _queryRepositoryFactory = queryRepositoryFactory;
            if (FirebaseApp.DefaultInstance == null)
            {
                FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromFile("./sadef-push-notifcation-334e08b65082.json")
                });
            }
        }

        public async Task<Response<DeviceTokenDto>> RegisterDeviceToken(string UserID, string FcmToken, string DeviceType)
        {
            var dto = new RegisterDeviceTokenDto
            {
                UserId = UserID,
                DeviceToken = FcmToken,
                DeviceType = DeviceType
            };

            if (string.IsNullOrWhiteSpace(dto.UserId) || string.IsNullOrWhiteSpace(dto.DeviceToken))
                return new Response<DeviceTokenDto>("UserId and DeviceToken are required.");

            var repo = _queryRepositoryFactory.QueryRepository<Domain.Users.UserDeviceToken>();
            var existing = await repo.Queryable().FirstOrDefaultAsync(x => x.UserId == dto.UserId && x.DeviceToken == dto.DeviceToken);

            Domain.Users.UserDeviceToken tokenEntity;
            if (existing == null)
            {
                tokenEntity = _mapper.Map<Domain.Users.UserDeviceToken>(dto);
                await _uow.RepositoryAsync<Domain.Users.UserDeviceToken>().AddAsync(tokenEntity);
                await _uow.SaveChangesAsync(CancellationToken.None);
            }
            else
            {
                tokenEntity = existing;
            }

            var responseDto = _mapper.Map<DeviceTokenDto>(tokenEntity);
            return new Response<DeviceTokenDto>(responseDto, "Device token registered successfully.");
        }

        public async Task<Response<string>> UnregisterDeviceToken(UnregisterDeviceTokenDto dto)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.Users.UserDeviceToken>();

            var token = await repo.Queryable().FirstOrDefaultAsync(x => x.UserId == dto.UserId && x.DeviceToken == dto.DeviceToken);
            if (token != null)
            {
                await _uow.RepositoryAsync<Domain.Users.UserDeviceToken>().DeleteAsync(token);
                await _uow.SaveChangesAsync(CancellationToken.None);
            }
            return new Response<string>("Token Unregistered successfully.");
        }

        public async Task<bool> TestSendNotificationToMultipleAsync(string title, string body, string userId, IDictionary<string, string>? data = null)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.Users.UserDeviceToken>();
            var tokens = await repo.Queryable()
                .Where(x => x.UserId == userId)
                .Select(x => x.DeviceToken)
                .ToListAsync();

            if (!tokens.Any())
                return false;

            var multicastMessage = new MulticastMessage
            {
                Tokens = tokens,
                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data != null
                    ? new Dictionary<string, string>(data)
                    : new Dictionary<string, string>()
            };

            var response = await FirebaseMessaging.DefaultInstance.SendEachForMulticastAsync(multicastMessage);

            Console.WriteLine($"Sent {response.SuccessCount} notifications, {response.FailureCount} failed.");
            return response.FailureCount == 0;
        }

        public async Task<bool> SendLeadCreatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null)
        {
            return await SendNotificationToTopicAsync("admins", title, body, data);
        }

        public async Task<List<string>> GetAdminAndSuperAdminUserIdsAsync()
        {
            var adminRoles = new[] { "Admin", "SuperAdmin" };
            var users = await _userManager.Users
                .Where(u => adminRoles.Contains(u.Role))
                .Select(u => u.Id.ToString())
                .ToListAsync();
            return users;
        }

        public async Task SubscribeToTopicAsync(string token, string topic)
        {
            if (string.IsNullOrWhiteSpace(token))
                return;

            var response = await FirebaseMessaging.DefaultInstance
                .SubscribeToTopicAsync(new List<string> { token }, topic);

            Console.WriteLine($"{response.SuccessCount} token(s) subscribed to {topic}");
        }

        public async Task<bool> SendNotificationToTopicAsync(string topic, string title, string body, IDictionary<string, string>? data = null)
        {
            var message = new Message
            {
                Topic = topic,
                Notification = new FirebaseAdmin.Messaging.Notification
                {
                    Title = title,
                    Body = body
                },
                Data = data != null
                    ? new Dictionary<string, string>(data)
                    : new Dictionary<string, string>()
            };

            try
            {
                var response = await FirebaseMessaging.DefaultInstance.SendAsync(message);

                Console.WriteLine($"Successfully sent message to topic '{topic}': {response}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending message to topic '{topic}': {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendPropertyCreatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null)
        {
            return await SendNotificationToTopicAsync("all", title, body, data);
        }
        public async Task<bool> SendAdminMaintenanceRequestCreatedAsync(string title, string body, IDictionary<string, string>? data = null)
        {
            return await SendNotificationToTopicAsync("admins", title, body, data);
        }
        public async Task<bool> SendPropertyUpdatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null)
        {
            return await SendNotificationToTopicAsync("admins", title, body, data);
        }
    }
}
