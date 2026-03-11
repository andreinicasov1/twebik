using System.Security.Claims;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Achievement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/achievements")]
    [ApiController]
    [Authorize]
    public class AchievementsController : ControllerBase
    {
        internal IAchievementAction _achievement;

        public AchievementsController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _achievement = bl.AchievementAction();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_achievement.GetAllAchievementsAction());
        }

        [HttpGet("me")]
        public IActionResult Mine()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(_achievement.GetUserAchievementsAction(userId));
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] CreateAchievementDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _achievement.CreateAchievementAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return Ok(result.Data);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] CreateAchievementDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _achievement.UpdateAchievementAction(id, data);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(result.Data);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var result = _achievement.DeleteAchievementAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
