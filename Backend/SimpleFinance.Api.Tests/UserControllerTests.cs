using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleFinance.Api.Data;
using SimpleFinance.Api.Controllers;
using System.Security.Claims;
using Xunit;

public class UsersControllerTests
{
    [Fact]
    public void Me_Returns_Unauthorized_When_No_User()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase("UsersTests")
            .Options;

        var context = new ApplicationDbContext(options);
        var controller = new UsersController(context);

        var httpContext = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity())
        };
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        var result = controller.Me();

        Assert.IsType<UnauthorizedResult>(result);
    }
}