using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Repositories.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<IReadOnlyList<Category>> GetActiveByUserIdAsync(Guid userId);
    Task<Category?> GetActiveByIdAndUserIdAsync(Guid id, Guid userId);
    Task<Category?> GetActiveByNameAndUserIdAsync(string name, Guid userId, Guid? excludeId = null);
    Task<int> CountActiveByUserIdAsync(Guid userId);
    Task AddRangeAsync(IEnumerable<Category> categories);
}
