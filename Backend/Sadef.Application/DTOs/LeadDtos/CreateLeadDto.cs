using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LeadDtos
{
    public class CreateLeadDto
    {
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public string? Message { get; set; }
        public int? PropertyId { get; set; }
    }

}
