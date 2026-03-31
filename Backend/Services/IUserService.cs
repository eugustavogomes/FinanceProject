using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Services;

public interface IUserService
{
    Task<User> GetByIdAsync(Guid userId);
    Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
    Task UpdatePreferencesAsync(Guid userId, UserPreferencesDto dto);
}
