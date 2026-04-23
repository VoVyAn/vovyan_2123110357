using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace vovyan_2123110357.Models
{
    public class User
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [Required]
        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;

        [JsonPropertyName("fullName")]
        public string? FullName { get; set; }

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;

        [JsonPropertyName("role")]
        public string Role { get; set; } = "User"; // Admin/UserCaptain/UserPhucvu

        [JsonPropertyName("code")]
        public string? Code { get; set; } // 4-digit code
    }
}