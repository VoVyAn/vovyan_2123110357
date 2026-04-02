namespace vovyan_2123110357.Models
{
    public class ProductDetail
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public string Color { get; set; }
        public string Size { get; set; }

        public int Stock { get; set; }

        public string ImageUrl { get; set; }
    }
}