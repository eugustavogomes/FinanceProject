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
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.EndsWith("nameidentifier"));
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .ToListAsync();
        return Ok(transactions);
    }
}
