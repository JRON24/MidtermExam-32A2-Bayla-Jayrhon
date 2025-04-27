namespace StudentAPI.DTOs
{
    public class StudentReadDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string StudentNumber { get; set; }
        public string Course { get; set; }
        public int Age { get; set; }
    }
}
