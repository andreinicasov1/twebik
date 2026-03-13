using System.Security.Claims;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Clan;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/clans")]
    [ApiController]
    [Authorize]
    public class ClansController : ControllerBase
    {
        internal IClanAction _clan;

        public ClansController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _clan = bl.ClanAction();
        }

        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_clan.GetAllClansAction());
        }

        [HttpGet("leaderboard")]
        public IActionResult Leaderboard()
        {
            return Ok(_clan.GetClanLeaderboardAction());
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var c = _clan.GetClanByIdAction(id);
            if (c == null) return NotFound(new { message = "Clanul nu există." });
            return Ok(c);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateClanDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _clan.CreateClanAction(data, UserId);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return CreatedAtAction(nameof(Get), new { id = ((ClanDto)result.Data!).Id }, result.Data);
        }

        [HttpPost("{id:int}/join")]
        public IActionResult Join(int id)
        {
            var result = _clan.JoinClanAction(id, UserId);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return NoContent();
        }

        [HttpPost("leave")]
        public IActionResult Leave()
        {
            var result = _clan.LeaveClanAction(UserId);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var result = _clan.DeleteClanAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
