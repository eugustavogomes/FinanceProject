using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

        [HttpGet("summary")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> GetSummary()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type.EndsWith("nameidentifier"));
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Usuário não autenticado ou id inválido.");
            }
            var income = await _context.Transactions.Where(t => t.UserId == userId && t.Type == "Income").SumAsync(t => t.Value);
            var expense = await _context.Transactions.Where(t => t.UserId == userId && t.Type == "Expense").SumAsync(t => t.Value);
            var balance = income - expense;
            return Ok(new { income, expense, balance });
        }
}
