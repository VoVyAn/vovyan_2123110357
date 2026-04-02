using System.ComponentModel.DataAnnotations;

namespace vovyan_2123110357.Models
{
    public class Product
    {
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int Id { get; set; }

        [Required]
        public List<ProductDetail>? Details { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public double Price { get; set; }

        public int Quantity { get; set; }

        public string ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}