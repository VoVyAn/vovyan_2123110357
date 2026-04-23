namespace vovyan_2123110357.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public double TotalAmount { get; set; }

        public int? TableId { get; set; }
        public string Status { get; set; } = "Pending";
        public string? DiscountCode { get; set; }
        public double DiscountAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}