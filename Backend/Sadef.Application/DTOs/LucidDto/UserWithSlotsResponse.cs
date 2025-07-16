using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LucidDto
{
    public class UserWithSlotsResponse
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        //public string? AppointmentNumber { get; set; } // <-- New field
        public List<TimeslotDto> BookedSlots { get; set; }
    }

    public class TimeslotDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Description { get; set; }
        public string? AppointmentNumber { get; set; }
        public string SlotDate { get; set; }


    }

}
