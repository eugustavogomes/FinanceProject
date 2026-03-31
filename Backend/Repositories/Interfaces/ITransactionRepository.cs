using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Repositories.Interfaces;

public interface ITransactionRepository : IRepository<Transaction>
{
    Task<IReadOnlyList<Transaction>> GetByUserIdAsync(Guid userId);
    Task<Transaction?> GetByIdAndUserIdAsync(Guid id, Guid userId);
    Task<decimal> SumByTypeAsync(Guid userId, TransactionType type, int? monthIndex);
}
