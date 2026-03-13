using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { status = "ok", timestamp = DateTime.UtcNow });
        }
    }
}
