using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Repositories.Interfaces;

// Goal uses int Id instead of Guid, so it does not inherit from IRepository<T>
public interface IGoalRepository
{
    Task<IReadOnlyList<Goal>> GetByUserIdAsync(Guid userId);
    Task<Goal?> GetByIdAndUserIdAsync(int id, Guid userId);
    Task AddAsync(Goal goal);
    Task DeleteAsync(Goal goal);
    Task SaveChangesAsync();
}
