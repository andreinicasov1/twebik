using System.Security.Claims;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.News;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/news")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        internal INewsAction _news;

        public NewsController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _news = bl.NewsAction();
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            return Ok(_news.GetAllNewsAction());
        }

        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Create([FromBody] CreateNewsDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var authorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = _news.CreateNewsAction(data, authorId);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return Ok(result.Data);
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] CreateNewsDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _news.UpdateNewsAction(id, data);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return Ok(result.Data);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var result = _news.DeleteNewsAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
