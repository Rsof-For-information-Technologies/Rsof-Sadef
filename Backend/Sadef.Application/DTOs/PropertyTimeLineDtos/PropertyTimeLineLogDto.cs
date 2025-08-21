using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.PropertyTimeLineDtos
{
    public class PropertyTimeLineLogDto
    {
        public int Id { get; set; }
        public required int PropertyId { get; set; }
        public PropertyStatus Status { get; set; }
        public required string ActionTaken { get; set; }
        public required string ActionTakenBy { get; set; }
        public DateTime Timestamp { get; set; }
    }
}