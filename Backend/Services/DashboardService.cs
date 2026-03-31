using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class DashboardService : IDashboardService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IUserRepository _userRepository;

    public DashboardService(ITransactionRepository transactionRepository, IUserRepository userRepository)
    {
        _transactionRepository = transactionRepository;
        _userRepository = userRepository;
    }

    public async Task<(decimal income, decimal expense, decimal balance)> GetSummaryAsync(Guid userId, int? month)
    {
        if (!await _userRepository.ExistsAsync(userId))
            throw new UnauthorizedAccessException("Usuário não foi encontrado. Faça login novamente.");

        var income = await _transactionRepository.SumByTypeAsync(userId, TransactionType.Income, month);
        var expense = await _transactionRepository.SumByTypeAsync(userId, TransactionType.Expense, month);

        return (income, expense, income - expense);
    }
}
