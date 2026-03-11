using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using System.Linq;

namespace SimpleFinance.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;

    public TransactionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<TransactionDto>> GetTransactionsAsync(Guid userId)
    {
        await EnsureUserExistsAsync(userId);

        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.Date)
            .ToListAsync();

        return transactions
            .Select(t => MapToDto(t))
            .ToList();
    }

    public async Task<TransactionDto> AddTransactionAsync(Guid userId, CreateTransactionDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var date = NormalizeDate(dto.Date);

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Value = dto.Value,
            Date = date,
            Description = dto.Description,
            Type = dto.Type,
            CategoryId = dto.CategoryId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return MapToDto(transaction, categoryName: null);
    }

    public async Task<TransactionDto> UpdateTransactionAsync(Guid userId, Guid transactionId, CreateTransactionDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

        if (transaction == null)
        {
            throw new KeyNotFoundException("Transaction not found.");
        }

        transaction.Value = dto.Value;
        transaction.Type = dto.Type;
        transaction.CategoryId = dto.CategoryId;
        transaction.Date = NormalizeDate(dto.Date);
        transaction.Description = dto.Description;

        await _context.SaveChangesAsync();

        return MapToDto(transaction, categoryName: null);
    }

    public async Task DeleteTransactionAsync(Guid userId, Guid transactionId)
    {
        await EnsureUserExistsAsync(userId);

        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == transactionId && t.UserId == userId);

        if (transaction == null)
        {
            throw new KeyNotFoundException("Transaction not found.");
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }

    private async Task EnsureUserExistsAsync(Guid userId)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            throw new UnauthorizedAccessException("User not found. Please log in again.");
        }
    }

    private static void Validate(CreateTransactionDto dto)
    {
        if (dto.Type != TransactionType.Income && dto.Type != TransactionType.Expense)
        {
            throw new DomainException("The 'Type' field must be 'Income' or 'Expense'.");
        }

        if (dto.Value < 0)
        {
            throw new DomainException("The transaction value cannot be negative.");
        }
    }

    private static DateTime NormalizeDate(DateTime date)
    {
        if (date.Kind == DateTimeKind.Unspecified)
        {
            return DateTime.SpecifyKind(date, DateTimeKind.Utc);
        }

        return date;
    }

    private static TransactionDto MapToDto(Transaction transaction, string? categoryName = null)
    {
        return new TransactionDto
        {
            Id = transaction.Id,
            Value = transaction.Value,
            Date = transaction.Date,
            Description = transaction.Description,
            Type = transaction.Type,
            CategoryId = transaction.CategoryId,
            CategoryName = categoryName ?? transaction.Category?.Name
        };
    }
}
