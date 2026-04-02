using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly CartService _service;

        public CartController(CartService service)
        {
            _service = service;
        }

        [HttpPost("add")]
        public IActionResult Add(int userId, int productDetailId, int quantity)
        {
            return Ok(_service.AddToCart(userId, productDetailId, quantity));
        }

        [HttpGet("{userId}")]
        public IActionResult Get(int userId)
        {
            return Ok(_service.GetCart(userId));
        }

        [HttpDelete("item/{id}")]
        public IActionResult Delete(int id)
        {
            _service.RemoveItem(id);
            return Ok();
        }
    }
}