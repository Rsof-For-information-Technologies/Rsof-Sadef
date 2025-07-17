using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LucidDto
{
    public class RescheduleSlotRequest
    {
        public string UserId { get; set; }
        public string NewDate { get; set; }
        public string NewTime { get; set; }
    }

}
