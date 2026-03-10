using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public InvestmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private bool TryGetUserId(out Guid userId)
    {
        userId = Guid.Empty;
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.EndsWith("nameidentifier"));
        return userIdClaim != null && Guid.TryParse(userIdClaim.Value, out userId);
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetInvestments()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var investments = await _context.Investments
            .Where(i => i.UserId == userId)
            .OrderBy(i => i.Name)
            .ToListAsync();

        return Ok(investments);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> CreateInvestment([FromBody] InvestmentDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Nome do investimento é obrigatório.");

        if (dto.CurrentValue < 0 || dto.InvestedAmount < 0)
            return BadRequest("Valores não podem ser negativos.");

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

        _context.Investments.Add(investment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInvestments), new { id = investment.Id }, investment);
    }

    [HttpPut("{id:guid}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateInvestment(Guid id, [FromBody] InvestmentDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var investment = await _context.Investments.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (investment == null)
            return NotFound();

        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Nome do investimento é obrigatório.");

        if (dto.CurrentValue < 0 || dto.InvestedAmount < 0)
            return BadRequest("Valores não podem ser negativos.");

        investment.Name = dto.Name.Trim();
        investment.Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim();
        investment.CurrentValue = dto.CurrentValue;
        investment.InvestedAmount = dto.InvestedAmount;
        investment.ExpectedReturnYearly = dto.ExpectedReturnYearly;
        investment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(investment);
    }

    [HttpDelete("{id:guid}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteInvestment(Guid id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var investment = await _context.Investments.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (investment == null)
            return NotFound();

        _context.Investments.Remove(investment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
