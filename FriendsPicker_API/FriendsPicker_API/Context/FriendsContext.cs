using FriendsPicker_API.Model;
using Microsoft.EntityFrameworkCore;

namespace FriendsPicker_API.Context
{
    public class FriendsContext : DbContext
    {
        public FriendsContext(DbContextOptions<FriendsContext> options)
            : base(options)
        {
        }

        public DbSet<Friend> Friends { get; set; }
    }
}