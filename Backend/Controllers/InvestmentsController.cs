using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Services;
using System.Security.Claims;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvestmentsController : ControllerBase
{
    private readonly IInvestmentService _investmentService;

    public InvestmentsController(IInvestmentService investmentService)
    {
        _investmentService = investmentService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetInvestments()
    {
        var userId = GetUserId();
        var investments = await _investmentService.GetInvestmentsAsync(userId);
        return Ok(investments);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateInvestment([FromBody] InvestmentDto dto)
    {
        var userId = GetUserId();
        var investment = await _investmentService.CreateInvestmentAsync(userId, dto);
        return CreatedAtAction(nameof(GetInvestments), new { id = investment.Id }, investment);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateInvestment(Guid id, [FromBody] InvestmentDto dto)
    {
        var userId = GetUserId();
        var investment = await _investmentService.UpdateInvestmentAsync(userId, id, dto);
        return Ok(investment);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteInvestment(Guid id)
    {
        var userId = GetUserId();
        await _investmentService.DeleteInvestmentAsync(userId, id);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim == null || !Guid.TryParse(claim.Value, out var userId))
            throw new UnauthorizedAccessException("Usuário não autenticado ou id inválido.");
        return userId;
    }
}
