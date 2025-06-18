using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class CreateMaintenanceRequestDto
    {
        public int LeadId { get; set; }
        public required string Description { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }
    }

}
