using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<bool> ExistsAsync(Guid userId);
    Task<User?> GetByIdAsync(Guid userId);
    Task<User?> GetByEmailOrUsernameAsync(string? email, string? username);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
    Task AddAsync(User user);
    Task SaveChangesAsync();
}
