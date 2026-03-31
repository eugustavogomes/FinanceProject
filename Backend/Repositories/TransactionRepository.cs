using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetByIdAsync(Guid id)
        => await _context.Transactions.FindAsync(id);

    public async Task<IReadOnlyList<Transaction>> GetByUserIdAsync(Guid userId)
        => await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

    public async Task<Transaction?> GetByIdAndUserIdAsync(Guid id, Guid userId)
        => await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

    public async Task<decimal> SumByTypeAsync(Guid userId, TransactionType type, int? monthIndex)
    {
        var query = _context.Transactions.Where(t => t.UserId == userId && t.Type == type);

        if (monthIndex.HasValue && monthIndex.Value >= 0 && monthIndex.Value <= 11)
            query = query.Where(t => t.Date.Month == monthIndex.Value + 1);

        return await query.SumAsync(t => t.Value);
    }

    public async Task AddAsync(Transaction transaction)
        => await _context.Transactions.AddAsync(transaction);

    public Task DeleteAsync(Transaction transaction)
    {
        _context.Transactions.Remove(transaction);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
        => await _context.SaveChangesAsync();
}
