using System.ComponentModel.DataAnnotations;

namespace vovyan_2123110357.Model
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public double Price { get; set; }

        public int Quantity { get; set; }
    }
}
