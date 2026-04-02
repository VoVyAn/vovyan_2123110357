using vovyan_2123110357.Data;
using vovyan_2123110357.Models;
using Microsoft.EntityFrameworkCore;

namespace vovyan_2123110357.Services
{
    public class CartService
    {
        private readonly AppDbContext _context;

        public CartService(AppDbContext context)
        {
            _context = context;
        }

        public Cart GetCart(int userId)
        {
            return _context.Carts
                .Where(c => c.UserId == userId)
                .Include(c => c.Items)
                .FirstOrDefault();
        }

        public Cart CreateCart(int userId)
        {
            var cart = new Cart { UserId = userId };
            _context.Carts.Add(cart);
            _context.SaveChanges();
            return cart;
        }

        public Cart AddToCart(int userId, int productDetailId, int quantity)
        {
            var cart = GetCart(userId) ?? CreateCart(userId);

            var item = _context.CartItems
                .FirstOrDefault(i => i.CartId == cart.Id && i.ProductDetailId == productDetailId);

            if (item != null)
            {
                item.Quantity += quantity;
            }
            else
            {
                _context.CartItems.Add(new CartItem
                {
                    CartId = cart.Id,
                    ProductDetailId = productDetailId,
                    Quantity = quantity
                });
            }

            _context.SaveChanges();
            return cart;
        }

        public void RemoveItem(int itemId)
        {
            var item = _context.CartItems.Find(itemId);
            if (item != null)
            {
                _context.CartItems.Remove(item);
                _context.SaveChanges();
            }
        }
    }
}