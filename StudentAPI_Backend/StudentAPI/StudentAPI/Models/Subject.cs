namespace StudentAPI.Models
{
    public class Subject
    {
        public int Id { get; set; }          // Primary Key
        public string Code { get; set; }
        public string Description { get; set; }

        public ICollection<Section> Sections { get; set; }  // A subject has many sections
    }
}
