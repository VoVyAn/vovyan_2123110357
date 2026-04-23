using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Models;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoriesController(CategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpPost]
        public IActionResult Create([FromBody] Category c)
        {
            if (c == null) return BadRequest("Invalid category data.");
            return Ok(_service.Create(c));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Category c)
        {
            var result = _service.Update(id, c);
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