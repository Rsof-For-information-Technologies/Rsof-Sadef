using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs
{
    public record ForgotPasswordDto(string Email,string clientUrl);
}
