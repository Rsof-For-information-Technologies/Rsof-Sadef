namespace Sadef.Application.DTOs.ActivityLogDtos
{
    public class ActivityLogCreateDto
    {
        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string? Category { get; set; }  // Optional: "Admin" or "Public"
        public string? Action { get; set; }
        public string? EntityType { get; set; }
        public int? EntityId { get; set; }
        public string? IPAddress { get; set; }
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
    }

}
