using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleFinance.Api.Dtos;
using SimpleFinance.Api.Services;
using System.Security.Claims;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly IGoalService _goalService;

    public GoalsController(IGoalService goalService)
    {
        _goalService = goalService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetGoals()
    {
        var userId = GetUserId();
        var goals = await _goalService.GetGoalsAsync(userId);
        return Ok(goals);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateGoal([FromBody] GoalDto dto)
    {
        var userId = GetUserId();
        var goal = await _goalService.CreateGoalAsync(userId, dto);
        return CreatedAtAction(nameof(GetGoals), new { id = goal.Id }, goal);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> UpdateGoal(int id, [FromBody] GoalDto dto)
    {
        var userId = GetUserId();
        var goal = await _goalService.UpdateGoalAsync(userId, id, dto);
        return Ok(goal);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeleteGoal(int id)
    {
        var userId = GetUserId();
        await _goalService.DeleteGoalAsync(userId, id);
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
