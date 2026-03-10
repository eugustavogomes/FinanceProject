using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Models;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public GoalsController(ApplicationDbContext context)
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
    public async Task<IActionResult> GetGoals()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var goals = await _context.Goals
            .Where(g => g.UserId == userId)
            .OrderBy(g => g.Year)
            .ThenBy(g => g.Month)
            .ToListAsync();

        return Ok(goals);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> CreateGoal([FromBody] GoalDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        if (dto.Target <= 0)
            return BadRequest("O valor da meta deve ser maior que zero.");

        if (dto.Month < 1 || dto.Month > 12)
            return BadRequest("Mês inválido.");

        if (dto.Year < DateTime.UtcNow.Year - 1)
            return BadRequest("Ano muito antigo para uma meta.");

        var goal = new Goal
        {
            Target = dto.Target,
            Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim(),
            Month = dto.Month,
            Year = dto.Year,
            UserId = userId
        };

        _context.Goals.Add(goal);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGoals), new { id = goal.Id }, goal);
    }

    [HttpPut("{id:int}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateGoal(int id, [FromBody] GoalDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
        if (goal == null)
            return NotFound();

        if (dto.Target <= 0)
            return BadRequest("O valor da meta deve ser maior que zero.");

        if (dto.Month < 1 || dto.Month > 12)
            return BadRequest("Mês inválido.");

        if (dto.Year < DateTime.UtcNow.Year - 1)
            return BadRequest("Ano muito antigo para uma meta.");

        goal.Target = dto.Target;
        goal.Category = string.IsNullOrWhiteSpace(dto.Category) ? null : dto.Category.Trim();
        goal.Month = dto.Month;
        goal.Year = dto.Year;

        await _context.SaveChangesAsync();

        return Ok(goal);
    }

    [HttpDelete("{id:int}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteGoal(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized("Usuário não autenticado ou id inválido.");

        var goal = await _context.Goals.FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);
        if (goal == null)
            return NotFound();

        _context.Goals.Remove(goal);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
