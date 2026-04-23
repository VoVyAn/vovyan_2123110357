using System.ComponentModel.DataAnnotations;

namespace vovyan_2123110357.Models
{
    public class Banner
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public string MediaUrl { get; set; }

        [Required]
        public string MediaType { get; set; } // "image" or "video"

        public bool IsActive { get; set; } = true;
        
        public int Order { get; set; } = 0;
    }
}
