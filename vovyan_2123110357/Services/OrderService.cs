using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using Microsoft.EntityFrameworkCore;

namespace vovyan_2123110357.Services
{
    public class OrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public Order Checkout(int userId)
        {
            var cart = _context.Carts
                .Where(c => c.UserId == userId)
                .FirstOrDefault();

            if (cart == null) return null;

            var items = _context.CartItems
                .Where(i => i.CartId == cart.Id)
                .ToList();
            if (!items.Any()) return null;

            double total = 0;

            var order = new Order
            {
                UserId = userId,
                TotalAmount = 0
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            foreach (var item in items)
            {
                var detail = _context.ProductDetails
                    .Include(d => d.Product)
                    .FirstOrDefault(d => d.Id == item.ProductDetailId);
                if (detail == null) continue;

                var price = detail.Product.Price;

                total += price * item.Quantity;

                _context.OrderDetails.Add(new OrderDetail
                {
                    OrderId = order.Id,
                    ProductDetailId = item.ProductDetailId,
                    Quantity = item.Quantity,
                    Price = price
                });
            }

            order.TotalAmount = total;

            _context.CartItems.RemoveRange(items);
            _context.SaveChanges();

            return order;
        }
    }
}