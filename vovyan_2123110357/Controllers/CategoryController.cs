using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Models;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpPost]
        public IActionResult Create(Category c) => Ok(_service.Create(c));
    }
}