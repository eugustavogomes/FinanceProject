using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Dtos;
using System.Security.Claims;

namespace SimpleFinance.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetCategories()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }
        
        var userCategoryCount = await _context.Categories.CountAsync(c => c.UserId == userId);
        if (userCategoryCount == 0)
        {
            await SeedBasicCategoriesForUser(userId);
        }

        var categories = await _context.Categories
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name))
            return BadRequest("Nome da categoria é obrigatório.");

        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());

        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower() && c.UserId == userId);
        
        if (existingCategory != null)
            return BadRequest("Já existe uma categoria com este nome.");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            UserId = userId
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryDto dto)
    {
        if (string.IsNullOrEmpty(dto.Name))
            return BadRequest("Nome da categoria é obrigatório.");

        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }
        
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (category == null)
            return NotFound();

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower() && c.Id != id && c.UserId == userId);
        
        if (existingCategory != null)
            return BadRequest("Já existe uma categoria com este nome.");

        category.Name = dto.Name;

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException());
        
        var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Unauthorized("Usuário não foi encontrado. Faça login novamente.");
        }
        
        var category = await _context.Categories
            .Include(c => c.Transactions)
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        
        if (category == null)
            return NotFound();

        if (category.Transactions != null && category.Transactions.Any())
        {
            return BadRequest("Não é possível excluir categoria que possui transações associadas.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task SeedBasicCategoriesForUser(Guid userId)
    {
        var basicCategories = new List<Category>
        {
            new Category { Id = Guid.NewGuid(), Name = "Alimentação", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Aluguel", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Transporte", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Conta de Água", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Conta de Luz", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Internet", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Telefone", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Saúde", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Educação", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Lazer", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Salário", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Freelance", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Investimentos", UserId = userId },
            new Category { Id = Guid.NewGuid(), Name = "Outros", UserId = userId }
        };

        _context.Categories.AddRange(basicCategories);
        await _context.SaveChangesAsync();
    }
}
