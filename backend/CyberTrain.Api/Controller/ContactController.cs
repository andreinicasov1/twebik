using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.Message;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        internal IMessageAction _message;

        public ContactController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _message = bl.MessageAction();
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult Send([FromBody] CreateMessageDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _message.CreateMessageAction(data);
            return Ok(new { message = result.Message });
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_message.GetAllMessagesAction());
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateMessageDto data)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = _message.UpdateMessageStatusAction(id, data.Status);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return NoContent();
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var result = _message.DeleteMessageAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
