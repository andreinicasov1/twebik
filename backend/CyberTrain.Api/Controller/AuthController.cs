using System.Security.Claims;
using CyberTrain.BusinessLayer.Interfaces;
using CyberTrain.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CyberTrain.Api.Controller
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        internal IUserLoginAction _userLogin;
        internal IUserRegAction _userReg;

        public AuthController()
        {
            var bl = new BusinessLayer.BusinessLogic();
            _userLogin = bl.UserLoginAction();
            _userReg = bl.UserRegAction();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto udata)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = _userLogin.UserLoginDataValidation(udata);
            if (!result.IsSuccess || result.Data == null)
            {
                return Unauthorized(new { message = result.Message });
            }
            return Ok(result.Data);
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto uReg)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = _userReg.UserRegDataValidation(uReg);
            if (!result.IsSuccess || result.Data == null)
            {
                return BadRequest(new { message = result.Message });
            }
            return Ok(result.Data);
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = _userLogin.GetUserById(userId);
            if (user == null) return NotFound(new { message = "Utilizator inexistent." });
            return Ok(user);
        }
    }
}
