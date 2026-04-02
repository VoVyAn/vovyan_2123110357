namespace vovyan_2123110357.Models
{
    public class SystemSetting
    {
        public int Id { get; set; }
        public string RestaurantName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string OpenHours { get; set; }
        public string Theme { get; set; } = "DarkBlue";
    }
}
