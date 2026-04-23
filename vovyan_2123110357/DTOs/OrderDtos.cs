namespace vovyan_2123110357.DTOs
{
    public class POSOrderRequest
    {
        public int? TableId { get; set; }
        public List<POSOrderItemRequest> Items { get; set; }
        public double TotalAmount { get; set; }
        public int? UserId { get; set; }
        public string? DiscountCode { get; set; }
    }

    public class POSOrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
