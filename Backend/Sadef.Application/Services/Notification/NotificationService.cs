using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Sadef.Application.Abstractions.Interfaces;
using Sadef.Application.DTOs.NotificationDtos;
using Sadef.Application.Hubs;
using Sadef.Common.Domain;
using Sadef.Domain.NotificationEntity;

namespace Sadef.Application.Services.Notification
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWorkAsync _uow;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IMapper _mapper;
        private readonly IQueryRepositoryFactory _queryRepositoryFactory;

        public NotificationService(IUnitOfWorkAsync uow, IHubContext<NotificationHub> hubContext, IMapper mapper, IQueryRepositoryFactory queryRepositoryFactory)
        {
            _uow = uow;
            _hubContext = hubContext;
            _mapper = mapper;
            _queryRepositoryFactory = queryRepositoryFactory;
        }

        public async Task CreateAndDispatchAsync(string title, string message, List<Guid> userIds)
        {
            foreach (var userId in userIds)
            {
                var notification = new Domain.NotificationEntity.Notification
                {
                    Title = title,
                    Message = message,
                    UserId = userId.ToString(), // Convert Guid to string to match the UserId property type
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false
                };

                await _uow.RepositoryAsync<Domain.NotificationEntity.Notification>().AddAsync(notification);

                // Send real-time notification to SignalR group (userId as string)
                await _hubContext.Clients.Group(userId.ToString()) // Convert Guid to string for SignalR group
                    .SendAsync("ReceiveNotification", new
                    {
                        Title = title,
                        Message = message,
                        Date = DateTime.UtcNow
                    });
            }

            await _uow.SaveChangesAsync(CancellationToken.None);
        }

        public async Task<List<NotificationDto>> GetUnreadForUserAsync(string userId)
        {
            var queryRepo = _queryRepositoryFactory.QueryRepository<Domain.NotificationEntity.Notification>();
            var notifications = await queryRepo.Queryable()
                .Where(n => n.UserId == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<NotificationDto>>(notifications);
        }

        public async Task MarkAsReadAsync(int notificationId, string userId)
        {
            var repo = _queryRepositoryFactory.QueryRepository<Domain.NotificationEntity.Notification>();
            var notif = await repo.Queryable().FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
            if (notif != null)
            {
                notif.IsRead = true;
                await _uow.RepositoryAsync<Domain.NotificationEntity.Notification>().UpdateAsync(notif);
                await _uow.SaveChangesAsync(CancellationToken.None);
            }
        }

        public async Task<IActionResult> SendTestNotification()
        {
            //var testUserEmail = "rademo1394@kimdyn.com"; // Match what the client is added to
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
            {
                title = "Test",
                message = "This is a test notification (ALL)"
            });

            return new OkObjectResult("Notification sent");
        }
    }
}
