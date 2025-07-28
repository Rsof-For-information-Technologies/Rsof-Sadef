using Sadef.Domain.Constants;
using Sadef.Common.Domain;
using Sadef.Domain.PropertyEntity;
namespace Sadef.Domain.LeadEntity
{
    public class Lead : AggregateRootBase
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public string? Message { get; set; }
        public int? PropertyId { get; set; }
        public LeadStatus Status { get; set; }
        public Property? Property { get; set; }

    }

}
