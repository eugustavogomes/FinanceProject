namespace SimpleFinance.Api.Services;

public interface IDashboardService
{
    Task<(decimal income, decimal expense, decimal balance)> GetSummaryAsync(Guid userId, int? month);
}
