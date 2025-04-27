using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAPI.Models;
using StudentAPI.DTOs;

namespace StudentAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SectionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/section
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SectionDTO>>> GetSections()
        {
            var sections = await _context.Sections
                .Include(s => s.Subject) // Include Subject in the response
                .ToListAsync();

            return Ok(sections.Select(s => new SectionDTO
            {
                Name = s.Name,
                SubjectId = s.SubjectId ?? 0
            }));
        }

        // GET: api/section/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SectionDTO>> GetSection(int id)
        {
            var section = await _context.Sections
                .Include(s => s.Subject) // Include Subject in the response
                .FirstOrDefaultAsync(s => s.Id == id);

            if (section == null)
            {
                return NotFound("Section not found");
            }

            return Ok(new SectionDTO
            {
                Name = section.Name,
                SubjectId = section.SubjectId ?? 0
            });
        }

        // POST: api/section
        [HttpPost]
        public async Task<ActionResult<SectionDTO>> CreateSection(SectionDTO sectionDto)
        {
            var section = new Section
            {
                Name = sectionDto.Name,
                SubjectId = sectionDto.SubjectId
            };

            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSection), new { id = section.Id }, sectionDto);
        }

        // PUT: api/section/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSection(int id, SectionDTO sectionDto)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound("Section not found");
            }

            section.Name = sectionDto.Name;
            section.SubjectId = sectionDto.SubjectId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/section/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSection(int id)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null)
            {
                return NotFound("Section not found");
            }

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
