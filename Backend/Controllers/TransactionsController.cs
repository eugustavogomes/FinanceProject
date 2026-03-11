using Microsoft.AspNetCore.Mvc;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Services;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetTransactions()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated or invalid id.");

        var transactions = await _transactionService.GetTransactionsAsync(userId);
        return Ok(transactions);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> AddTransaction([FromBody] CreateTransactionDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated or invalid id.");

        var created = await _transactionService.AddTransactionAsync(userId, dto);
        return Ok(created);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] CreateTransactionDto dto)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated or invalid id.");

        var updated = await _transactionService.UpdateTransactionAsync(userId, id, dto);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated or invalid id.");

        await _transactionService.DeleteTransactionAsync(userId, id);
        return NoContent();
    }
}
