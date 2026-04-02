namespace vovyan_2123110357.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; }

        public string Method { get; set; } // COD, VNPAY

        public string Status { get; set; } = "Unpaid";
    }
}