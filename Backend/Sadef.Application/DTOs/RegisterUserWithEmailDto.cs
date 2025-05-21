using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sadef.Application.DTOs
{
    public record RegisterUserWithEmailDto(
        string FirstName,
        string LastName,
        string Email,
        string Password,
        string ConfirmPassword,
        string Role
    );

}
