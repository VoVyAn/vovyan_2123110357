using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Models;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountController : ControllerBase
    {
        private readonly DiscountService _service;

        public DiscountController(DiscountService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var discount = _service.GetById(id);
            if (discount == null) return NotFound();
            return Ok(discount);
        }

        [HttpPost]
        public IActionResult Create(DiscountCode discount)
        {
            return Ok(_service.Create(discount));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, DiscountCode updated)
        {
            var result = _service.Update(id, updated);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var success = _service.Delete(id);
            if (!success) return NotFound();
            return Ok();
        }
    }
}
