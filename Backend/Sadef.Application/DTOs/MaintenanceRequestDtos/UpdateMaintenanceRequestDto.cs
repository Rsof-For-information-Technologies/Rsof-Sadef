using Microsoft.AspNetCore.Http;
using Sadef.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class UpdateMaintenanceRequestDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }

    }
}
