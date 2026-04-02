using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _service;

        public OrderController(OrderService service)
        {
            _service = service;
        }

        [HttpPost("checkout")]
        public IActionResult Checkout(int userId)
        {
            var order = _service.Checkout(userId);
            if (order == null) return BadRequest();

            return Ok(order);
        }
    }
}