using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Services;
using vovyan_2123110357.Models;
using vovyan_2123110357.DTOs;
using vovyan_2123110357.Data;

namespace vovyan_2123110357.Controllers
{
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _service;
        private readonly AppDbContext _context;

        public OrderController(OrderService service, AppDbContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpPost("checkout")]
        public IActionResult Checkout(int userId)
        {
            var order = _service.Checkout(userId);
            if (order == null) return BadRequest();

            return Ok(order);
        }

        [HttpPost("pos")]
        public IActionResult CreatePOSOrder([FromBody] POSOrderRequest request)
        {
            var order = _service.CreatePOSOrder(request.TableId, request.Items, request.TotalAmount, request.UserId, request.DiscountCode);
            return Ok(order);
        }

        [HttpGet("validate-pin/{pin}")]
        public IActionResult ValidatePin(string pin)
        {
            var user = _context.Users.FirstOrDefault(u => u.Code == pin);
            if (user == null) return NotFound();
            return Ok(new { id = user.Id, username = user.Username, role = user.Role });
        }
    }
}