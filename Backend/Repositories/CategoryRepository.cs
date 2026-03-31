using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Category?> GetByIdAsync(Guid id)
        => await _context.Categories.FindAsync(id);

    public async Task<IReadOnlyList<Category>> GetActiveByUserIdAsync(Guid userId)
        => await _context.Categories
            .Where(c => c.UserId == userId && c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync();

    public async Task<Category?> GetActiveByIdAndUserIdAsync(Guid id, Guid userId)
        => await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId && c.IsActive);

    public async Task<Category?> GetActiveByNameAndUserIdAsync(string name, Guid userId, Guid? excludeId = null)
    {
        var query = _context.Categories
            .Where(c => c.IsActive && c.Name!.ToLower() == name.ToLower() && c.UserId == userId);

        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);

        return await query.FirstOrDefaultAsync();
    }

    public async Task<int> CountActiveByUserIdAsync(Guid userId)
        => await _context.Categories.CountAsync(c => c.UserId == userId && c.IsActive);

    public async Task AddAsync(Category category)
        => await _context.Categories.AddAsync(category);

    public async Task AddRangeAsync(IEnumerable<Category> categories)
        => await _context.Categories.AddRangeAsync(categories);

    public Task DeleteAsync(Category category)
    {
        _context.Categories.Remove(category);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
