using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace Sadef.Common.Infrastructure.AspNetCore.All.Controllers
{
    [Route("")]
    [ApiVersionNeutral]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : Controller
    {
        [HttpGet("/error")]
        public IActionResult Index()
        {
            return new BadRequestResult();
        }
    }
}
