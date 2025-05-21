using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs
{
    public record UpdateUserDto(string UserId,
        string FirstName,
        string LastName,
        string Email,
        string Role);
}
