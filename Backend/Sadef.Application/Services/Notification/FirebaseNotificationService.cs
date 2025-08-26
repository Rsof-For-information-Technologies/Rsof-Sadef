using AutoMapper;
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
        private readonly string _accessToken;
        private readonly IUnitOfWorkAsync _uow;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly IUserManagementService _userManagementService;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;


        public FirebaseNotificationService(IConfiguration config, IUnitOfWorkAsync uow, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory, IUserManagementService userManagementService)
        {
            _uow = uow;
            _mapper = mapper;
            _config = config;
            _httpClient = new HttpClient();
            _projectId = _config["Firebase:ProjectId"];
            _userManagementService = userManagementService;
            _queryRepositoryFactory = queryRepositoryFactory;
            _accessToken = FirebaseNotificationHelper.GetAccessToken(_config["Firebase:ServiceAccountJson"]);
        }

        public async Task<bool> SendNotificationAsync(string title, string body, string deviceToken, IDictionary<string, string>? data = null)
        {
            var message = new
            {
                message = new
                {
                    token = deviceToken,
                    notification = new { title, body },
                    data = data
                }
            };
            return await SendFcmMessageAsync(message);
        }

        public async Task<bool> TestSendNotificationToMultipleAsync(string title, string body, string userId, IDictionary<string, string>? data = null)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.Users.UserDeviceToken>();
            var tokens = await repo.Queryable().Where(x => x.UserId == userId).Select(x => x.DeviceToken).ToListAsync();

            if (!tokens.Any())
                return false;

            bool allSucceeded = true;
            foreach (var token in tokens)
            {
                var message = new
                {
                    message = new
                    {
                        token = token,
                        notification = new { title, body },
                        data = data
                    }
                };
                var success = await SendFcmMessageAsync(message);
                if (!success) allSucceeded = false;
            }
            return allSucceeded;
        }

        public async Task<bool> SendNotificationToMultipleAsync(string title, string body, List<string> deviceTokens, IDictionary<string, string>? data = null)
        {
            if (!deviceTokens.Any())
                return false;

            var message = new
            {
                message = new
                {
                    tokens = deviceTokens,
                    notification = new { title, body },
                    data = data
                }
            };
            return await SendFcmMessageAsync(message);
        }

        public async Task<bool> SendNotificationToTopicAsync(string title, string body, string topic, IDictionary<string, string>? data = null)
        {
            var message = new
            {
                message = new
                {
                    topic = topic,
                    notification = new { title, body },
                    data = data
                }
            };
            return await SendFcmMessageAsync(message);
        }

        private async Task<bool> SendFcmMessageAsync(object message)
        {
            var url = $"https://fcm.googleapis.com/v1/projects/{_projectId}/messages:send";
            var json = JsonSerializer.Serialize(message);
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            // Log the request details
            Console.WriteLine($"[FirebaseNotificationService] FCM Request URL: {url}");
            Console.WriteLine($"[FirebaseNotificationService] FCM Request Payload: {json}");

            var response = await _httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"[FirebaseNotificationService] FCM Response Status: {response.StatusCode}");
            Console.WriteLine($"[FirebaseNotificationService] FCM Response Body: {responseBody}");
            return response.IsSuccessStatusCode;
        }
        public async Task<Response<DeviceTokenDto>> RegisterDeviceToken(RegisterDeviceTokenDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.UserId) || string.IsNullOrWhiteSpace(dto.DeviceToken))
                return new Response<DeviceTokenDto>("UserId and DeviceToken are required.");

            var userResponse = await _userManagementService.GetUserByIdAsync(Guid.Parse(dto.UserId));
            if (userResponse == null || userResponse.Data == null)
                return new Response<DeviceTokenDto>("User not found");

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

        public async Task SendLeadCreatedNotificationToAdminsAsync(string title, string body, IDictionary<string, string>? data = null)
        {
            var adminUserIds = await _userManagementService.GetAdminAndSuperAdminUserIdsAsync();
            var repo = _queryRepositoryFactory.QueryRepository<Domain.Users.UserDeviceToken>();
            var tokens = await repo.Queryable()
                .Where(t => adminUserIds.Contains(t.UserId))
                .Select(t => t.DeviceToken)
                .ToListAsync();

            if (tokens.Any())
            {
                await SendNotificationToMultipleAsync(title, body, tokens, data);
            }
        }
    }
}
