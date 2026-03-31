using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IUserRepository _userRepository;

    public TransactionService(ITransactionRepository transactionRepository, IUserRepository userRepository)
    {
        _transactionRepository = transactionRepository;
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyList<TransactionDto>> GetTransactionsAsync(Guid userId)
    {
        await EnsureUserExistsAsync(userId);

        var transactions = await _transactionRepository.GetByUserIdAsync(userId);
        return transactions.Select(t => MapToDto(t)).ToList();
    }

    public async Task<TransactionDto> AddTransactionAsync(Guid userId, CreateTransactionDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Value = dto.Value,
            Date = NormalizeDate(dto.Date),
            Description = dto.Description,
            Type = dto.Type,
            CategoryId = dto.CategoryId
        };

        await _transactionRepository.AddAsync(transaction);
        await _transactionRepository.SaveChangesAsync();

        return MapToDto(transaction, categoryName: null);
    }

    public async Task<TransactionDto> UpdateTransactionAsync(Guid userId, Guid transactionId, CreateTransactionDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var transaction = await _transactionRepository.GetByIdAndUserIdAsync(transactionId, userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        transaction.Value = dto.Value;
        transaction.Type = dto.Type;
        transaction.CategoryId = dto.CategoryId;
        transaction.Date = NormalizeDate(dto.Date);
        transaction.Description = dto.Description;

        await _transactionRepository.SaveChangesAsync();

        return MapToDto(transaction, categoryName: null);
    }

    public async Task DeleteTransactionAsync(Guid userId, Guid transactionId)
    {
        await EnsureUserExistsAsync(userId);

        var transaction = await _transactionRepository.GetByIdAndUserIdAsync(transactionId, userId)
            ?? throw new KeyNotFoundException("Transaction not found.");

        await _transactionRepository.DeleteAsync(transaction);
        await _transactionRepository.SaveChangesAsync();
    }

    private async Task EnsureUserExistsAsync(Guid userId)
    {
        if (!await _userRepository.ExistsAsync(userId))
            throw new UnauthorizedAccessException("User not found. Please log in again.");
    }

    private static void Validate(CreateTransactionDto dto)
    {
        if (dto.Type != TransactionType.Income && dto.Type != TransactionType.Expense)
            throw new DomainException("The 'Type' field must be 'Income' or 'Expense'.");

        if (dto.Value < 0)
            throw new DomainException("The transaction value cannot be negative.");
    }

    private static DateTime NormalizeDate(DateTime date)
    {
        if (date.Kind == DateTimeKind.Unspecified)
            return DateTime.SpecifyKind(date, DateTimeKind.Utc);

        return date;
    }

    private static TransactionDto MapToDto(Transaction transaction, string? categoryName = null) => new TransactionDto
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
