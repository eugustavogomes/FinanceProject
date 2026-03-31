using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Exceptions;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Repositories.Interfaces;

namespace SimpleFinance.Api.Services;

public class InvestmentService : IInvestmentService
{
    private readonly IInvestmentRepository _investmentRepository;
    private readonly IUserRepository _userRepository;

    public InvestmentService(IInvestmentRepository investmentRepository, IUserRepository userRepository)
    {
        _investmentRepository = investmentRepository;
        _userRepository = userRepository;
    }

    public async Task<IReadOnlyList<Investment>> GetInvestmentsAsync(Guid userId)
    {
        await EnsureUserExistsAsync(userId);
        return await _investmentRepository.GetByUserIdAsync(userId);
    }

    public async Task<Investment> CreateInvestmentAsync(Guid userId, InvestmentDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var investment = new Investment
        {
            Name = dto.Name.Trim(),
            Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim(),
            CurrentValue = dto.CurrentValue,
            InvestedAmount = dto.InvestedAmount,
            ExpectedReturnYearly = dto.ExpectedReturnYearly,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _investmentRepository.AddAsync(investment);
        await _investmentRepository.SaveChangesAsync();

        return investment;
    }

    public async Task<Investment> UpdateInvestmentAsync(Guid userId, Guid id, InvestmentDto dto)
    {
        await EnsureUserExistsAsync(userId);
        Validate(dto);

        var investment = await _investmentRepository.GetByIdAndUserIdAsync(id, userId)
            ?? throw new KeyNotFoundException("Investment not found.");

        investment.Name = dto.Name.Trim();
        investment.Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim();
        investment.CurrentValue = dto.CurrentValue;
        investment.InvestedAmount = dto.InvestedAmount;
        investment.ExpectedReturnYearly = dto.ExpectedReturnYearly;
        investment.UpdatedAt = DateTime.UtcNow;

        await _investmentRepository.SaveChangesAsync();

        return investment;
    }

    public async Task DeleteInvestmentAsync(Guid userId, Guid id)
    {
        await EnsureUserExistsAsync(userId);

        var investment = await _investmentRepository.GetByIdAndUserIdAsync(id, userId)
            ?? throw new KeyNotFoundException("Investment not found.");

        await _investmentRepository.DeleteAsync(investment);
        await _investmentRepository.SaveChangesAsync();
    }

    private async Task EnsureUserExistsAsync(Guid userId)
    {
        if (!await _userRepository.ExistsAsync(userId))
            throw new UnauthorizedAccessException("User not found. Please log in again.");
    }

    private static void Validate(InvestmentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new DomainException("Nome do investimento é obrigatório.");

        if (dto.CurrentValue < 0 || dto.InvestedAmount < 0)
            throw new DomainException("Valores não podem ser negativos.");
    }
}
