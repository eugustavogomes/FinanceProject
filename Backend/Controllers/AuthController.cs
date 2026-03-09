using jwtBearer.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SimpleFinance.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto dto)
        {
            if (_db.Users.Any(user => user.Email == dto.Email))
                return BadRequest("User already exists.");

            if (!string.IsNullOrWhiteSpace(dto.Username) && _db.Users.Any(user => user.Username == dto.Username))
                return BadRequest("Username already taken.");

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Name = dto.Name,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),

            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) && string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest("Username or email is required.");

            if (string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Password is required.");

            var user = _db.Users.FirstOrDefault(user =>
                (!string.IsNullOrWhiteSpace(dto.Email) && user.Email == dto.Email) ||
                (!string.IsNullOrWhiteSpace(dto.Username) && user.Username == dto.Username));

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            var email = user.Email ?? string.Empty;
            var token = TokenService.GenerateToken(user.Id, email, user.Name);
            return Ok(new { token });
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email);


            return Ok("If an account exists for this email, a reset link has been sent.");
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest("New password is required.");

            var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email);

            if (user == null)
                return Ok("If an account exists for this email, the password has been reset.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync();

            return Ok("If an account exists for this email, the password has been reset.");
        }

    }
}