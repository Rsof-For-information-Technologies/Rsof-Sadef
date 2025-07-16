using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sadef.Domain.Users;

namespace Sadef.Application.Services.Whatsapp
{
    public interface IWhatsappService
    {
        Task RequestLocationAsync(string mobileNumber, UserInfo user , string time);


    }
}
