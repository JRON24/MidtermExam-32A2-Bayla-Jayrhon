using StudentAPI.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class Student
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? StudentNumber { get; set; } // ✅ Nullable

    public string? Course { get; set; } // ✅ Nullable

    public int? Age { get; set; } // ✅ Nullable

    public ICollection<StudentSection> StudentSections { get; set; } = new List<StudentSection>();

    // ✅ Computed property (not mapped to the database)
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";
}
