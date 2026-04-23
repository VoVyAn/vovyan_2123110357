namespace vovyan_2123110357.Models
{
    public class DiscountCode
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public double Percentage { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
