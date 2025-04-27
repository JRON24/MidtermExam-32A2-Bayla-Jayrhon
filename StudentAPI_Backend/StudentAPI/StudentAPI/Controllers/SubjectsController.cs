using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;
using StudentAPI.DTOs;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/subject
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectDTO>>> GetSubjects()
        {
            var subjects = await _context.Subjects.ToListAsync();

            return Ok(subjects.Select(s => new SubjectDTO
            {
                Code = s.Code,
                Description = s.Description
            }));
        }

        // GET: api/subject/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectDTO>> GetSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);

            if (subject == null)
            {
                return NotFound("Subject not found");
            }

            return Ok(new SubjectDTO
            {
                Code = subject.Code,
                Description = subject.Description
            });
        }

        // POST: api/subject
        [HttpPost]
        public async Task<ActionResult<SubjectDTO>> CreateSubject(SubjectDTO subjectDto)
        {
            var subject = new Subject
            {
                Code = subjectDto.Code,
                Description = subjectDto.Description
            };

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subjectDto);
        }

        // PUT: api/subject/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id, SubjectDTO subjectDto)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound("Subject not found");
            }

            subject.Code = subjectDto.Code;
            subject.Description = subjectDto.Description;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/subject/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound("Subject not found");
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
