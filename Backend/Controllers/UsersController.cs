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

            return Ok(new { id = user.Id, email = user.Email, name = user.Name });
        }
    }
}
