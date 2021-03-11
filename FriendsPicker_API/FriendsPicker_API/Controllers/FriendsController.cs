using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FriendsPicker_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class FriendsController : Controller
    {
        // GET
        public IActionResult Test()
        {
            return Ok("Test");
        }
    }
}