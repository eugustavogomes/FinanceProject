using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Models;
using SimpleFinance.Api.Dtos;

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
    public async Task<IActionResult> GetCategories()
    {
        var categoryCount = await _context.Categories.CountAsync();
        if (categoryCount == 0)
        {
            await SeedBasicCategories();
        }

        var categories = await _context.Categories
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

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower());
        
        if (existingCategory != null)
            return BadRequest("Já existe uma categoria com este nome.");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type ?? "General"
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

        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound();

        var existingCategory = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.ToLower() == dto.Name.ToLower() && c.Id != id);
        
        if (existingCategory != null)
            return BadRequest("Já existe uma categoria com este nome.");

        category.Name = dto.Name;
        category.Type = dto.Type ?? "General";

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await _context.Categories
            .Include(c => c.Transactions)
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (category == null)
            return NotFound();

        // Verificar se há transações usando esta categoria
        if (category.Transactions != null && category.Transactions.Any())
        {
            return BadRequest("Não é possível excluir categoria que possui transações associadas.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private async Task SeedBasicCategories()
    {
        var basicCategories = new List<Category>
        {
            new Category { Id = Guid.NewGuid(), Name = "Alimentação", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Aluguel", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Transporte", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Conta de Água", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Conta de Luz", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Internet", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Telefone", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Saúde", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Educação", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Lazer", Type = "Expense" },
            new Category { Id = Guid.NewGuid(), Name = "Salário", Type = "Income" },
            new Category { Id = Guid.NewGuid(), Name = "Freelance", Type = "Income" },
            new Category { Id = Guid.NewGuid(), Name = "Investimentos", Type = "Income" },
            new Category { Id = Guid.NewGuid(), Name = "Outros", Type = "General" }
        };

        _context.Categories.AddRange(basicCategories);
        await _context.SaveChangesAsync();
    }
}
