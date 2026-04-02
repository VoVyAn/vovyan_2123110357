namespace vovyan_2123110357.Models
{
    public class RestaurantTable
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int Capacity { get; set; }
        public string Status { get; set; } = "Empty"; // Empty, Serving, Reserved
        public string? Note { get; set; }
    }
}
