using Sadef.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.MaintenanceRequestDtos
{
    public class UpdateAdminResponseDto
    {
        public required int Id { get; set; }
        public string? AdminResponse { get; set; }
        public MaintenanceRequestStatus? Status { get; set; }
    }
}
