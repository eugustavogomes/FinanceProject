using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> GetByIdAsync(Guid userId)
    {
        return await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
            throw new DomainException("Current password is required.");

        if (string.IsNullOrWhiteSpace(dto.NewPassword))
            throw new DomainException("New password is required.");

        if (dto.NewPassword.Length < 6)
            throw new DomainException("New password must be at least 6 characters long.");

        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            throw new DomainException("Current password is incorrect.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.SaveChangesAsync();
    }

    public async Task UpdatePreferencesAsync(Guid userId, UserPreferencesDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        if (dto.PreferredTheme != null)
            user.PreferredTheme = dto.PreferredTheme;

        if (dto.IsSidebarExpanded.HasValue)
            user.IsSidebarExpanded = dto.IsSidebarExpanded.Value;

        await _userRepository.SaveChangesAsync();
    }
}
