using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Repositories.Interfaces;

public interface IInvestmentRepository : IRepository<Investment>
{
    Task<IReadOnlyList<Investment>> GetByUserIdAsync(Guid userId);
    Task<Investment?> GetByIdAndUserIdAsync(Guid id, Guid userId);
}
