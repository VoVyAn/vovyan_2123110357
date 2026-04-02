namespace vovyan_2123110357.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int ProductDetailId { get; set; }

        public int Quantity { get; set; }

        public double Price { get; set; }
    }
}