using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace App.Api.Data.Entities
{
    public class StudentEntity
    {
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot be longer than 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot be longer than 50 characters")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Student number is required")]
        [RegularExpression(@"^\d{5}$", ErrorMessage = "Student number must be 5 digits")]
        public string StudentNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Class is required")]
        [StringLength(20, ErrorMessage = "Class cannot be longer than 20 characters")]
        public string Class { get; set; } = string.Empty;
    }
}