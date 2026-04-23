using System.ComponentModel.DataAnnotations;

namespace vovyan_2123110357.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; }

        [Required]
        [StringLength(20)]
        public string Phone { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        public int NumberOfGuests { get; set; }

        public string? StoreName { get; set; }

        public string? Note { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
