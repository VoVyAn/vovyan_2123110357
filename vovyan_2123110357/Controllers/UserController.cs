using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Models;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;
        private readonly JWTservice _jwtService;

        public UserController(UserService service, JWTservice jwtService)
        {
            _service = service;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            return Ok(_service.Register(user));
        }

        [HttpPost("login")]
        public IActionResult Login(User user)
        {
            var result = _service.Login(user.Username, user.Password);
            if (result == null) return Unauthorized();

            var token = _jwtService.GenerateToken(result);
            return Ok(new
            {
                user = result,
                token
            });
        }
    }
}