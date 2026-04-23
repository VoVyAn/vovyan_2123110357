using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using Microsoft.EntityFrameworkCore;

namespace vovyan_2123110357.Controllers
{
    [Route("api/banners")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BannersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Banners.OrderBy(b => b.Order).ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(Banner banner)
        {
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();
            return Ok(banner);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Banner updated)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            banner.Title = updated.Title;
            banner.Description = updated.Description;
            banner.MediaUrl = updated.MediaUrl;
            banner.MediaType = updated.MediaType;
            banner.IsActive = updated.IsActive;
            banner.Order = updated.Order;

            await _context.SaveChangesAsync();
            return Ok(banner);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null) return NotFound();

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
