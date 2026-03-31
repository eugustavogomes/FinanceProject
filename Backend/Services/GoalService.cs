using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class GoalService : IGoalService
{
    private readonly IGoalRepository _goalRepository;
    private readonly IUserRepository _userRepository;

    public GoalService(IGoalRepository goalRepository, IUserRepository userRepository)
    {
        _goalRepository = goalRepository;
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyList<Goal>> GetGoalsAsync(Guid userId)
    {
        await EnsureUserExistsAsync(userId);
        return await _goalRepository.GetByUserIdAsync(userId);
    }

    public async Task<Goal> CreateGoalAsync(Guid userId, GoalDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var goal = new Goal
        {
            Target = dto.Target,
            Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim(),
            Month = dto.Month,
            Year = dto.Year,
            UserId = userId
        };

        await _goalRepository.AddAsync(goal);
        await _goalRepository.SaveChangesAsync();

        return goal;
    }

    public async Task<Goal> UpdateGoalAsync(Guid userId, int id, GoalDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var goal = await _goalRepository.GetByIdAndUserIdAsync(id, userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        goal.Target = dto.Target;
        goal.Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim();
        goal.Month = dto.Month;
        goal.Year = dto.Year;

        await _goalRepository.SaveChangesAsync();

        return goal;
    }

    public async Task DeleteGoalAsync(Guid userId, int id)
    {
        await EnsureUserExistsAsync(userId);

        var goal = await _goalRepository.GetByIdAndUserIdAsync(id, userId)
            ?? throw new KeyNotFoundException("Goal not found.");

        await _goalRepository.DeleteAsync(goal);
        await _goalRepository.SaveChangesAsync();
    }

    private async Task EnsureUserExistsAsync(Guid userId)
    {
        if (!await _userRepository.ExistsAsync(userId))
            throw new UnauthorizedAccessException("User not found. Please log in again.");
    }

    private static void Validate(GoalDto dto)
    {
        if (dto.Target <= 0)
            throw new DomainException("O valor da meta deve ser maior que zero.");

        if (dto.Month < 1 || dto.Month > 12)
            throw new DomainException("Mês inválido.");

        if (dto.Year < DateTime.UtcNow.Year - 1)
            throw new DomainException("Ano muito antigo para uma meta.");
    }
}
