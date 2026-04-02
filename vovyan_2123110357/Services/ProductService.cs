using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using Microsoft.EntityFrameworkCore;

namespace vovyan_2123110357.Services
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        public List<Product> GetAll()
        {
            return _context.Products
                .Include(p => p.Category)
                .Include(p => p.Details)
                .OrderBy(p => p.Id)
                .ToList();
        }

        public Product GetById(int id)
        {
            return _context.Products
                .Include(p => p.Category)
                .Include(p => p.Details)
                .FirstOrDefault(p => p.Id == id);
        }

        public Product Create(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return product;
        }

        public Product Update(int id, Product updated)
        {
            var product = _context.Products.Find(id);
            if (product == null) return null;

            product.Name = updated.Name;
            product.Description = updated.Description;
            product.Price = updated.Price;
            product.Quantity = updated.Quantity;
            product.ImageUrl = updated.ImageUrl;
            product.CategoryId = updated.CategoryId;

            _context.SaveChanges();
            return product;
        }

        public bool Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            _context.SaveChanges();
            return true;
        }
    }
}