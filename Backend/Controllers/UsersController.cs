using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleFinance.Api.Services;
using System.Security.Claims;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = GetUserId();
        var user = await _userService.GetByIdAsync(userId);

        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            name = user.Name,
            preferredTheme = user.PreferredTheme,
            isSidebarExpanded = user.IsSidebarExpanded
        });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetUserId();
        await _userService.ChangePasswordAsync(userId, dto);
        return NoContent();
    }

    [Authorize]
    [HttpPut("me/preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UserPreferencesDto dto)
    {
        var userId = GetUserId();
        await _userService.UpdatePreferencesAsync(userId, dto);
        return NoContent();
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
        if (claim == null || !Guid.TryParse(claim.Value, out var userId))
            throw new UnauthorizedAccessException("Usuário não autenticado.");
        return userId;
    }
}
