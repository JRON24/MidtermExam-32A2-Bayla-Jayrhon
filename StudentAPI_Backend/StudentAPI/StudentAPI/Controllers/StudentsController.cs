using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.DTOs;
using StudentAPI.Models;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentReadDTO>>> GetStudents()
        {
            var students = await _context.Students
                .Select(s => new StudentReadDTO
                {
                    Id = s.Id,
                    FullName = s.FirstName + " " + s.LastName,
                    Email = s.Email,
                    StudentNumber = s.StudentNumber,
                    Course = s.Course,
                    Age = s.Age ?? 0  // Default to 0 if Age is null
                })
                .ToListAsync();

            return Ok(students);
        }

        // ✅ GET A STUDENT BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.StudentSections)
                .ThenInclude(ss => ss.Section)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (student == null)
                return NotFound("Student not found.");

            return Ok(student);
        }

        // ✅ CREATE A STUDENT
        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent(StudentDTO studentDto)
        {
            if (await _context.Students.AnyAsync(s => s.Email == studentDto.Email))
            {
                return BadRequest("Student with this email already exists.");
            }

            string studentNumber = "S" + Guid.NewGuid().ToString("N").Substring(0, 8);

            var student = new Student
            {
                FirstName = studentDto.FirstName,
                LastName = studentDto.LastName,
                Email = studentDto.Email,
                StudentNumber = studentNumber,
                Course = studentDto.Course,
                Age = studentDto.Age
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        // ✅ UPDATE A STUDENT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, StudentDTO studentDto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound("Student not found.");

            student.FirstName = studentDto.FirstName;
            student.LastName = studentDto.LastName;
            student.Email = studentDto.Email;
            student.Course = studentDto.Course;
            student.Age = studentDto.Age;

            _context.Entry(student).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok("Student updated successfully.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            // Check if the student exists
            if (student == null)
            {
                return NotFound("Student not found.");
            }

            try
            {
                // Remove the references in the StudentSections table
                var studentSections = _context.StudentSections.Where(ss => ss.StudentId == id);
                _context.StudentSections.RemoveRange(studentSections);

                // Remove the student record
                _context.Students.Remove(student);

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok("Student deleted successfully.");
            }
            catch (Exception ex)
            {
                // Log the detailed exception message
                Console.WriteLine($"Delete Error: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");

                // Return a generic server error response
                return StatusCode(500, "An error occurred while deleting the student.");
            }
        }





        // ✅ ENROLL A STUDENT IN A SECTION
        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollStudentInSection(int studentId, int sectionId)
        {
            var section = await _context.Sections.FindAsync(sectionId);
            if (section == null)
                return NotFound("Section not found.");

            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
                return NotFound("Student not found.");

            var alreadyEnrolled = await _context.StudentSections
                .AnyAsync(ss => ss.StudentId == studentId && ss.Section.SubjectId == section.SubjectId);

            if (alreadyEnrolled)
                return BadRequest("Student is already enrolled in a section with the same subject.");

            var studentSection = new StudentSection
            {
                StudentId = studentId,
                SectionId = sectionId
            };

            _context.StudentSections.Add(studentSection);
            await _context.SaveChangesAsync();

            return Ok("Student enrolled successfully.");
        }
    }
}
