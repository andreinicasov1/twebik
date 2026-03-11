using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        internal IAdminAction _admin;

        public AdminController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _admin = bl.AdminAction();
        }

        [HttpGet("stats")]
        public IActionResult Stats()
        {
            return Ok(_admin.GetAdminStatsAction());
        }

        [HttpGet("users")]
        public IActionResult Users()
        {
            return Ok(_admin.GetAllUsersAction());
        }

        [HttpPut("users/{id:int}/role")]
        public IActionResult ChangeRole(int id, [FromBody] ChangeRoleDto data)
        {
            var result = _admin.ChangeUserRoleAction(id, data.Role);
            if (!result.IsSuccess) return BadRequest(new { message = result.Message });
            return NoContent();
        }

        [HttpDelete("users/{id:int}")]
        public IActionResult Delete(int id)
        {
            var result = _admin.DeleteUserAction(id);
            if (!result.IsSuccess) return NotFound(new { message = result.Message });
            return NoContent();
        }
    }
}
