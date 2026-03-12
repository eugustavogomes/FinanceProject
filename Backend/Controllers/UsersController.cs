using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SimpleFinance.Api.Data;
using System.Linq;

namespace SimpleFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public UsersController(ApplicationDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null) return Unauthorized();

            if (!System.Guid.TryParse(userIdClaim.Value, out var userId)) return Unauthorized();

            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound();

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.Name,
                preferredTheme = user.PreferredTheme,
                isSidebarExpanded = user.IsSidebarExpanded
            });
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null) return Unauthorized();

            if (!System.Guid.TryParse(userIdClaim.Value, out var userId)) return Unauthorized();

            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound();

            if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                return BadRequest("Current password is required.");

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest("New password is required.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                return BadRequest("Current password is incorrect.");

            if (dto.NewPassword.Length < 6)
                return BadRequest("New password must be at least 6 characters long.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPut("me/preferences")]
        public async Task<IActionResult> UpdatePreferences([FromBody] UserPreferencesDto dto)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null) return Unauthorized();

            if (!System.Guid.TryParse(userIdClaim.Value, out var userId)) return Unauthorized();

            var user = _db.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return NotFound();

            if (dto.PreferredTheme != null)
            {
                user.PreferredTheme = dto.PreferredTheme;
            }

            if (dto.IsSidebarExpanded.HasValue)
            {
                user.IsSidebarExpanded = dto.IsSidebarExpanded.Value;
            }

            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
