using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using Microsoft.EntityFrameworkCore;

namespace vovyan_2123110357.Services
{
    public class DiscountService
    {
        private readonly AppDbContext _context;

        public DiscountService(AppDbContext context)
        {
            _context = context;
        }

        public List<DiscountCode> GetAll()
        {
            return _context.DiscountCodes.OrderByDescending(d => d.Id).ToList();
        }

        public DiscountCode GetById(int id)
        {
            return _context.DiscountCodes.Find(id);
        }

        public DiscountCode Create(DiscountCode discount)
        {
            _context.DiscountCodes.Add(discount);
            _context.SaveChanges();
            return discount;
        }

        public DiscountCode Update(int id, DiscountCode updated)
        {
            var discount = _context.DiscountCodes.Find(id);
            if (discount == null) return null;

            discount.Code = updated.Code;
            discount.Percentage = updated.Percentage;
            discount.ExpiryDate = updated.ExpiryDate;
            discount.IsActive = updated.IsActive;

            _context.SaveChanges();
            return discount;
        }

        public bool Delete(int id)
        {
            var discount = _context.DiscountCodes.Find(id);
            if (discount == null) return false;

            _context.DiscountCodes.Remove(discount);
            _context.SaveChanges();
            return true;
        }
    }
}
