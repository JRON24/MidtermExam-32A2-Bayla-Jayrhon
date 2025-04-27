using Microsoft.EntityFrameworkCore;

namespace StudentAPI.Models
{
    public class ApplicationDbContext : DbContext
    {
        // Constructor: Accepts options and passes them to the base class
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets (tables)
        public DbSet<Student> Students { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<StudentSection> StudentSections { get; set; }

        // OnModelCreating: Configures relationships and keys
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Many-to-Many Relationship between Students and Sections
            modelBuilder.Entity<StudentSection>()
                .HasKey(ss => new { ss.StudentId, ss.SectionId });

            modelBuilder.Entity<StudentSection>()
                .HasOne(ss => ss.Student)
                .WithMany(s => s.StudentSections)
                .HasForeignKey(ss => ss.StudentId);

            modelBuilder.Entity<StudentSection>()
                .HasOne(ss => ss.Section)
                .WithMany(s => s.StudentSections)
                .HasForeignKey(ss => ss.SectionId);
        }
    }
}
