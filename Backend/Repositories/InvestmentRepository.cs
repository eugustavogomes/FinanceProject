using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Repositories;

public class InvestmentRepository : IInvestmentRepository
{
    private readonly ApplicationDbContext _context;

    public InvestmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Investment?> GetByIdAsync(Guid id)
        => await _context.Investments.FindAsync(id);

    public async Task<IReadOnlyList<Investment>> GetByUserIdAsync(Guid userId)
        => await _context.Investments
            .Where(i => i.UserId == userId)
            .OrderBy(i => i.Name)
            .ToListAsync();

    public async Task<Investment?> GetByIdAndUserIdAsync(Guid id, Guid userId)
        => await _context.Investments.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

    public async Task AddAsync(Investment investment)
        => await _context.Investments.AddAsync(investment);

    public Task DeleteAsync(Investment investment)
    {
        _context.Investments.Remove(investment);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
