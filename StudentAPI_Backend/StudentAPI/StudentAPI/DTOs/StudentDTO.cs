namespace StudentAPI.DTOs
{
    public class StudentDTO
    {
        public int StudentId { get; set; } // 👈 Add this

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Course { get; set; }
        public int Age { get; set; }
    }
}
