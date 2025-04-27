namespace StudentAPI.Models
{
    public class Section
    {
        public int Id { get; set; }          // Primary Key
        public string Name { get; set; }

        public int? SubjectId { get; set; }   // Foreign Key

        public Subject Subject { get; set; } // The subject this section is part of
        public ICollection<StudentSection> StudentSections { get; set; }  // Many-to-many relationship with students
    }
}
