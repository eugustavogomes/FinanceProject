using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Repositories;

public class GoalRepository : IGoalRepository
{
    private readonly ApplicationDbContext _context;

    public GoalRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Goal>> GetByUserIdAsync(Guid userId)
        => await _context.Goals
            .Where(g => g.UserId == userId)
            .OrderBy(g => g.Year)
            .ThenBy(g => g.Month)
            .ToListAsync();

    public async Task<Goal?> GetByIdAndUserIdAsync(int id, Guid userId)
        => await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

    public async Task AddAsync(Goal goal)
        => await _context.Goals.AddAsync(goal);

    public Task DeleteAsync(Goal goal)
    {
        _context.Goals.Remove(goal);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
