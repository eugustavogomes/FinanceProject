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
        public async Task<IActionResult> GetSummary([FromQuery] int? month)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Usuário não autenticado ou id inválido.");
            }
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
            {
                return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
            }
            var baseQuery = _context.Transactions.Where(t => t.UserId == userId);
            if (month.HasValue && month.Value >= 0 && month.Value <= 11)
            {
                var monthNumber = month.Value + 1; // Date.Month is 1-12
                baseQuery = baseQuery.Where(t => t.Date.Month == monthNumber);
            }

            var income = await baseQuery.Where(t => t.Type == TransactionType.Income).SumAsync(t => t.Value);
            var expense = await baseQuery.Where(t => t.Type == TransactionType.Expense).SumAsync(t => t.Value);
            var balance = income - expense;
            return Ok(new { income, expense, balance });
        }
}
