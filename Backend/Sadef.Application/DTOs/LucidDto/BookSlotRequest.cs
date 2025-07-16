using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LucidDto
{
    public class BookSlotRequest
    {
        public string Date { get; set; }       // e.g., "2025-07-19"
        public string Time { get; set; }       // e.g., "12:30:00"
        public int UserId { get; set; }       // or you can use Id
    }


}
