using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FriendsPicker_API.Context;
using FriendsPicker_API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;

namespace FriendsPicker_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendsController : Controller
    {
        private readonly FriendsContext _context;
        public FriendsController(FriendsContext context) => _context = context;

        public record AddFriendModel(string FriendId);

        public async Task<IEnumerable<string>> GetAllFriends()
        {
            var userId = HttpContext.User.Claims.First(c => c.Type == ClaimConstants.ObjectId).Value;
            var friendShips = await _context.Friendships.Where(f => f.UserId == userId || f.FriendId == userId)
                .ToArrayAsync();
            return friendShips.Select(f => (f.UserId == userId) ? f.FriendId : f.UserId);
        }

        [Route("getAll")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await GetAllFriends());
        }


        [Route("add")]
        [HttpPost]
        public async Task<IActionResult> AddFriend([FromBody] AddFriendModel model)
        {
            var friendId = model.FriendId;
            if ((await GetAllFriends()).All(f => f != friendId))
            {
                var friendShip = new Friendship
                {
                    UserId = HttpContext.User.Claims.First(c => c.Type == ClaimConstants.ObjectId).Value,
                    FriendId = friendId
                };
                await _context.AddFriendShip(friendShip);
            }

            return await GetAll();
        }

        [Route("delete")]
        [HttpDelete]
        public async Task<IActionResult> DeleteFriend([FromBody] AddFriendModel model)
        {
            var friendId = model.FriendId;
            var userId = HttpContext.User.Claims.First(c => c.Type == ClaimConstants.ObjectId).Value;
            if ((await GetAllFriends()).Any(f => f == friendId))
            {
                await _context.DeleteFriendship(new Friendship {UserId = userId, FriendId = friendId});
            }

            return await GetAll();
        }
    }
}