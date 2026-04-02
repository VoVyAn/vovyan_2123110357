using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Models;
using vovyan_2123110357.Services;

namespace vovyan_2123110357.Controllers
{
    [Route("api/menus")]
    public class MenuController : ControllerBase
    {
        private readonly MenuService _service;

        public MenuController(MenuService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpPost]
        public IActionResult Create(Menu m) => Ok(_service.Create(m));
    }
}