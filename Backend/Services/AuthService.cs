using jwtBearer.Services;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> RegisterAsync(UserRegisterDto dto)
    {
        if (_context.Users.Any(u => u.Email == dto.Email))
            throw new DomainException("User already exists.");

        if (!string.IsNullOrWhiteSpace(dto.Username) && _context.Users.Any(u => u.Username == dto.Username))
            throw new DomainException("Username already taken.");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Name = dto.Name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return "User registered successfully.";
    }

    public Task<string> LoginAsync(UserLoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) && string.IsNullOrWhiteSpace(dto.Username))
            throw new DomainException("Username or email is required.");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new DomainException("Password is required.");

        var user = _context.Users.FirstOrDefault(u =>
            (!string.IsNullOrWhiteSpace(dto.Email) && u.Email == dto.Email) ||
            (!string.IsNullOrWhiteSpace(dto.Username) && u.Username == dto.Username));

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        var email = user.Email ?? string.Empty;
        var token = TokenService.GenerateToken(user.Id, email, user.Name);

        return Task.FromResult(token);
    }

    public Task ForgotPasswordAsync(ForgotPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new DomainException("Email is required.");

        // Email sending logic would go here
        return Task.CompletedTask;
    }

    public async Task ResetPasswordAsync(ResetPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new DomainException("Email is required.");

        if (string.IsNullOrWhiteSpace(dto.NewPassword))
            throw new DomainException("New password is required.");

        var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
        if (user == null)
            return;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _context.SaveChangesAsync();
    }
}
