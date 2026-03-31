using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Services;

public interface IInvestmentService
{
    Task<IReadOnlyList<Investment>> GetInvestmentsAsync(Guid userId);
    Task<Investment> CreateInvestmentAsync(Guid userId, InvestmentDto dto);
    Task<Investment> UpdateInvestmentAsync(Guid userId, Guid id, InvestmentDto dto);
    Task DeleteInvestmentAsync(Guid userId, Guid id);
}
