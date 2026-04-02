using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Data;
using vovyan_2123110357.Models;

namespace vovyan_2123110357.Controllers
{
    [Route("api/product-details")]
    [ApiController]
    public class ProductDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductDetailController(AppDbContext context)
        {
            _context = context;
        }

        // GET theo product
        [HttpGet("product/{productId}")]
        public IActionResult GetByProduct(int productId)
        {
            var data = _context.ProductDetails
                .Where(x => x.ProductId == productId)
                .ToList();

            return Ok(data);
        }

        // POST
        [HttpPost]
        public IActionResult Create(ProductDetail detail)
        {
            _context.ProductDetails.Add(detail);
            _context.SaveChanges();
            return Ok(detail);
        }
    }
}