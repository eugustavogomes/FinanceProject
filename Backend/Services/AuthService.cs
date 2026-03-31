using jwtBearer.Services;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;

    public AuthService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<string> RegisterAsync(UserRegisterDto dto)
    {
        if (await _userRepository.EmailExistsAsync(dto.Email!))
            throw new DomainException("User already exists.");

        if (!string.IsNullOrWhiteSpace(dto.Username) && await _userRepository.UsernameExistsAsync(dto.Username))
            throw new DomainException("Username already taken.");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Name = dto.Name,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return "User registered successfully.";
    }

    public async Task<string> LoginAsync(UserLoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) && string.IsNullOrWhiteSpace(dto.Username))
            throw new DomainException("Username or email is required.");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new DomainException("Password is required.");

        var user = await _userRepository.GetByEmailOrUsernameAsync(dto.Email, dto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid credentials.");

        var token = TokenService.GenerateToken(user.Id, user.Email ?? string.Empty, user.Name);

        return token;
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

        var user = await _userRepository.GetByEmailOrUsernameAsync(dto.Email, null);
        if (user == null)
            return;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.SaveChangesAsync();
    }
}
