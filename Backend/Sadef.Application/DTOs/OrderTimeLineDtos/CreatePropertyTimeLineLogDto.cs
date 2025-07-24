using Sadef.Domain.Constants;

namespace Sadef.Application.DTOs.OrderTimeLineDtos
{
    public class CreatePropertyTimeLineLogDto
    {
        public required int PropertyId { get; set; }
        public PropertyStatus Status { get; set; }
        public required string ActionTaken { get; set; }
        public required string ActionTakenBy { get; set; }
    }
}
