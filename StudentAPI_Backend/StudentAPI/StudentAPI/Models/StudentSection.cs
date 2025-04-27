namespace StudentAPI.Models
{
    public class StudentSection
    {
        public int StudentId { get; set; }    // Foreign Key to Student
        public int SectionId { get; set; }    // Foreign Key to Section

        public Student Student { get; set; }
        public Section Section { get; set; }
    }
}
