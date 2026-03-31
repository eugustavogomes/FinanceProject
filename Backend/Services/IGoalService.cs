using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Services;

public interface IGoalService
{
    Task<IReadOnlyList<Goal>> GetGoalsAsync(Guid userId);
    Task<Goal> CreateGoalAsync(Guid userId, GoalDto dto);
    Task<Goal> UpdateGoalAsync(Guid userId, int id, GoalDto dto);
    Task DeleteGoalAsync(Guid userId, int id);
}
