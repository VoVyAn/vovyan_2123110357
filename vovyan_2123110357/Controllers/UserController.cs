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
        public IActionResult Login([FromBody] vovyan_2123110357.DTOs.LoginRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            var result = _service.Login(request.Username, request.Password);
            if (result == null) return Unauthorized(new { message = "Invalid username or password" });

            var token = _jwtService.GenerateToken(result);
            return Ok(new
            {
                user = result,
                token
            });
        }
    }
}