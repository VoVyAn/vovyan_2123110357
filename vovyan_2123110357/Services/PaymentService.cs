using vovyan_2123110357.Data;
using vovyan_2123110357.Models;

namespace vovyan_2123110357.Services
{
    public class PaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public Payment Create(Payment p)
        {
            _context.Payments.Add(p);
            _context.SaveChanges();
            return p;
        }
    }
}