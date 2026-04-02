namespace vovyan_2123110357.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }

        public int ProductDetailId { get; set; }

        public int Quantity { get; set; }
    }
}