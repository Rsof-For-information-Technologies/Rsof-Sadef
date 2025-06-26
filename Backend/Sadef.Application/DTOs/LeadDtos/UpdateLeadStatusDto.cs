using Sadef.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.LeadDtos
{
    public class UpdateLeadStatusDto
    {
        public required int id { get; set; }
        public LeadStatus? status { get; set; }
    }
}
