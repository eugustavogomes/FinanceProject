using SimpleFinance.Api.Dtos;

namespace SimpleFinance.Api.Services;

public interface ICategoryService
{
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(Guid userId);
    Task<CategoryDto> CreateCategoryAsync(Guid userId, CreateCategoryDto dto);
    Task<CategoryDto> UpdateCategoryAsync(Guid userId, Guid categoryId, CreateCategoryDto dto);
    Task DeleteCategoryAsync(Guid userId, Guid categoryId);
}
