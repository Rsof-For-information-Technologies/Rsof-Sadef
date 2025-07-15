using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LucidDto
{
    public class TimeslotStatusDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string? Description { get; set; }
        public bool IsBooked { get; set; }
        public string? BookedBy { get; set; } // null if not booked
    }

}
