using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(Guid userId)
        => await _context.Users.AnyAsync(u => u.Id == userId);

    public async Task<User?> GetByIdAsync(Guid userId)
        => await _context.Users.FindAsync(userId);

    public async Task<User?> GetByEmailOrUsernameAsync(string? email, string? username)
        => await _context.Users.FirstOrDefaultAsync(u =>
            (!string.IsNullOrWhiteSpace(email) && u.Email == email) ||
            (!string.IsNullOrWhiteSpace(username) && u.Username == username));

    public async Task<bool> EmailExistsAsync(string email)
        => await _context.Users.AnyAsync(u => u.Email == email);

    public async Task<bool> UsernameExistsAsync(string username)
        => await _context.Users.AnyAsync(u => u.Username == username);

    public async Task AddAsync(User user)
        => await _context.Users.AddAsync(user);

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
