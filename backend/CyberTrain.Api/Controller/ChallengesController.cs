using System.Security.Claims;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Challenge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/challenges")]
    [ApiController]
    [Authorize]
    public class ChallengesController : ControllerBase
    {
        internal IChallengeAction _challenge;

        public ChallengesController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _challenge = bl.ChallengeAction();
        }

        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public IActionResult GetAll()
        {
            var list = _challenge.GetAllChallengesAction(UserId);
            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var item = _challenge.GetChallengeByIdAction(id, UserId);
            if (item == null) return NotFound(new { message = "Exercițiul nu există sau e rezervat unui clan." });
            return Ok(item);
        }

        [HttpPost("{id:int}/submit")]
        public IActionResult Submit(int id, [FromBody] SubmitAnswerDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _challenge.SubmitAnswerAction(id, UserId, dto.Answer);
            return Ok(result);
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] CreateChallengeDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _challenge.CreateChallengeAction(data);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return CreatedAtAction(nameof(Get), new { id = ((ChallengeAdminDto)result.Data!).Id }, result.Data);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] CreateChallengeDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _challenge.UpdateChallengeAction(id, data);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(result.Data);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var result = _challenge.DeleteChallengeAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
