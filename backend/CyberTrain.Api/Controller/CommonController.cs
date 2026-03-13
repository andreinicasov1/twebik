using System.Security.Claims;
using CyberTrain.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api")]
    [ApiController]
    [Authorize]
    public class CommonController : ControllerBase
    {
        internal ICommonAction _common;

        public CommonController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _common = bl.CommonAction();
        }

        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("leaderboard")]
        public IActionResult Leaderboard()
        {
            return Ok(_common.GetLeaderboardAction());
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            return Ok(_common.GetDashboardAction(UserId));
        }

        [HttpGet("profile")]
        public IActionResult Profile()
        {
            var p = _common.GetProfileAction(UserId);
            if (p == null) return NotFound(new { message = "Profil inexistent." });
            return Ok(p);
        }
    }
}
