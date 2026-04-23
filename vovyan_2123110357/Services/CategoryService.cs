using vovyan_2123110357.Data;
using vovyan_2123110357.Models;

namespace vovyan_2123110357.Services
{
    public class CategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public List<Category> GetAll() => _context.Categories.ToList();

        public Category Create(Category c)
        {
            _context.Categories.Add(c);
            _context.SaveChanges();
            return c;
        }

        public Category Update(int id, Category updated)
        {
            var existing = _context.Categories.Find(id);
            if (existing == null) return null;
            existing.Name = updated.Name;
            _context.SaveChanges();
            return existing;
        }

        public bool Delete(int id)
        {
            var existing = _context.Categories.Find(id);
            if (existing == null) return false;
            _context.Categories.Remove(existing);
            _context.SaveChanges();
            return true;
        }
    }
}