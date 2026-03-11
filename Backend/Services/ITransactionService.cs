using SimpleFinance.Api.Dtos;

namespace SimpleFinance.Api.Services;

public interface ITransactionService
{
    Task<IReadOnlyList<TransactionDto>> GetTransactionsAsync(Guid userId);
    Task<TransactionDto> AddTransactionAsync(Guid userId, CreateTransactionDto dto);
    Task<TransactionDto> UpdateTransactionAsync(Guid userId, Guid transactionId, CreateTransactionDto dto);
    Task DeleteTransactionAsync(Guid userId, Guid transactionId);
}
