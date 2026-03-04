using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public TransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetTransactions()
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }

        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .Select(t => new {
                t.Id,
                t.Value,
                t.Date,
                t.Description,
                t.Type,
                CategoryName = t.Category != null ? t.Category.Name : null
            })
            .ToListAsync();
        return Ok(transactions);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> AddTransaction([FromBody] Transaction transaction)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }

        if (transaction.Type != TransactionType.Income && transaction.Type != TransactionType.Expense)
            return BadRequest("O campo 'Type' deve ser 'Income' ou 'Expense'.");
        if (transaction.Value < 0)
            return BadRequest("O valor da transação não pode ser negativo.");

        transaction.UserId = userId;
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return Ok(transaction);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] Transaction updated)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }

        if (updated.Type != TransactionType.Income && updated.Type != TransactionType.Expense)
            return BadRequest("O campo 'Type' deve ser 'Income' ou 'Expense'.");
        if (updated.Value < 0)
            return BadRequest("O valor da transação não pode ser negativo.");

        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (transaction == null)
            return NotFound();

        transaction.Value = updated.Value;
        transaction.Type = updated.Type;
        transaction.CategoryId = updated.CategoryId;
        transaction.Date = updated.Date;
        transaction.Description = updated.Description;

        await _context.SaveChangesAsync();
        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }

        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (transaction == null)
            return NotFound();

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
