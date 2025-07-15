using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Common.Domain;

namespace Sadef.Domain.Users
{
    public class Timeslot: AggregateRootBase
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Description { get; set; }
        public int? UserInfoId { get; set; } // null = available
        public UserInfo? UserInfo { get; set; }
        public string? AppointmentNumber { get; set; } // <-- New field

    }
}
