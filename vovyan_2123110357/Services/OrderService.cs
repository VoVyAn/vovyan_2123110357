using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using vovyan_2123110357.DTOs;
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

        public Order CreatePOSOrder(int? tableId, List<POSOrderItemRequest> itemRequests, double totalAmount, int? userId, string? discountCode)
        {
            double discountAmount = 0;
            if (!string.IsNullOrEmpty(discountCode))
            {
                var discount = _context.DiscountCodes.FirstOrDefault(d => d.Code == discountCode && d.IsActive);
                if (discount != null)
                {
                    // If the discount exists, we calculate it based on the total. 
                    // Note: In a real app, we'd validate this more strictly.
                    discountAmount = (totalAmount * discount.Percentage) / 100;
                }
            }

            var order = new Order
            {
                TableId = tableId,
                TotalAmount = totalAmount - discountAmount,
                Status = "Paid",
                UserId = userId,
                DiscountCode = discountCode,
                DiscountAmount = discountAmount,
                CreatedAt = DateTime.Now
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            foreach (var itemReq in itemRequests)
            {
                // Find first available detail for this product
                var detail = _context.ProductDetails
                    .FirstOrDefault(d => d.ProductId == itemReq.ProductId);
                
                if (detail == null) continue;

                _context.OrderDetails.Add(new OrderDetail
                {
                    OrderId = order.Id,
                    ProductDetailId = detail.Id,
                    Quantity = itemReq.Quantity,
                    Price = itemReq.Price
                });
            }

            if (tableId.HasValue)
            {
                var table = _context.RestaurantTables.Find(tableId.Value);
                if (table != null) table.Status = "Empty";
            }

            _context.SaveChanges();
            return order;
        }
    }
}