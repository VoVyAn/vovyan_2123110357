using vovyan_2123110357.Data;
using vovyan_2123110357.Models;

namespace vovyan_2123110357.Services
{
    public class MenuService
    {
        private readonly AppDbContext _context;

        public MenuService(AppDbContext context)
        {
            _context = context;
        }

        public List<Menu> GetAll() => _context.Menus.ToList();

        public Menu Create(Menu m)
        {
            _context.Menus.Add(m);
            _context.SaveChanges();
            return m;
        }
    }
}