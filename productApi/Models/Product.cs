using System.ComponentModel.DataAnnotations;

namespace productApi.Models
{
    public class Product
    {
        public int Id { get; set; }  

        [Required(ErrorMessage = "Name is required")]
        public required string Name { get; set; }

        public string? Description { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be >= 0")]
        public double Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "QuantityInStock must be >= 0")]
        public int QuantityInStock { get; set; }

        public string? Category { get; set; }
    }
}
