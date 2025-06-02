using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs.UserDtos
{
    public class VerifyEmailRequestDto
    {
        public required string UserId { get; set; }
        public required string Token { get; set; }
    }
}
