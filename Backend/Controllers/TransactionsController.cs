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
            return Unauthorized("User not authenticated or invalid id.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }

        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .Select(t => new {
                id = t.Id,
                value = t.Value,
                date = t.Date,
                description = t.Description,
                type = t.Type,
                categoryId = t.CategoryId,
                categoryName = t.Category != null ? t.Category.Name : null
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
            return Unauthorized("User not authenticated or invalid id.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }

        if (transaction.Type != TransactionType.Income && transaction.Type != TransactionType.Expense)
            return BadRequest("The 'Type' field must be 'Income' or 'Expense'.");
        if (transaction.Value < 0)
            return BadRequest("The transaction value cannot be negative.");

        if (transaction.Date.Kind == DateTimeKind.Unspecified)
            transaction.Date = DateTime.SpecifyKind(transaction.Date, DateTimeKind.Utc);

        transaction.UserId = userId;
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var result = new
        {
            id = transaction.Id,
            value = transaction.Value,
            date = transaction.Date,
            description = transaction.Description,
            type = transaction.Type,
            categoryId = transaction.CategoryId,
            categoryName = (string?)null
        };

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateTransaction(Guid id, [FromBody] Transaction updated)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated or invalid id.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }

        if (updated.Type != TransactionType.Income && updated.Type != TransactionType.Expense)
            return BadRequest("The 'Type' field must be 'Income' or 'Expense'.");
        if (updated.Value < 0)
            return BadRequest("The transaction value cannot be negative.");

        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (transaction == null)
            return NotFound();

        if (updated.Date.Kind == DateTimeKind.Unspecified)
            updated.Date = DateTime.SpecifyKind(updated.Date, DateTimeKind.Utc);

        transaction.Value = updated.Value;
        transaction.Type = updated.Type;
        transaction.CategoryId = updated.CategoryId;
        transaction.Date = updated.Date;
        transaction.Description = updated.Description;

        await _context.SaveChangesAsync();

        var result = new
        {
            id = transaction.Id,
            value = transaction.Value,
            date = transaction.Date,
            description = transaction.Description,
            type = transaction.Type,
            categoryId = transaction.CategoryId,
            categoryName = (string?)null
        };

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteTransaction(Guid id)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("User not authenticated or invalid id.");

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("User not found. Please log in again.");
        }

        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (transaction == null)
            return NotFound();

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
