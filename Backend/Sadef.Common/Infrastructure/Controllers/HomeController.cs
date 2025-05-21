using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Sadef.Common.Infrastructure.AspNetCore.Configuration;
using Asp.Versioning;

namespace Sadef.Common.Infrastructure.AspNetCore.All.Controllers
{
    [Route("")]
    [ApiVersionNeutral]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class HomeController : Controller
    {
        private readonly string _basePath;

        public HomeController(IConfiguration config)
        {
            _basePath = config.GetBasePath() ?? "/";
        }

        [HttpGet]
        public IActionResult Index()
        {
            return Redirect($"~{_basePath}swagger");
        }
    }
}
