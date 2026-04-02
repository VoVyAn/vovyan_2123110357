using System.ComponentModel.DataAnnotations;

namespace vovyan_2123110357.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public string Role { get; set; } = "User"; // Admin/User
    }
}