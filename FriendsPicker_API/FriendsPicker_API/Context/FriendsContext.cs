using System.Linq;
using System.Threading.Tasks;
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

        public DbSet<Friendship> Friendships { get; set; }

        public async Task AddFriendShip(Friendship friendShip)
        {
            await using var transaction = await this.Database.BeginTransactionAsync();
            await Friendships.AddAsync(friendShip);

            await SaveChangesAsync();
            await transaction.CommitAsync();
        }

        public async Task DeleteFriendship(Friendship friendShip)
        {
            await using var transaction = await Database.BeginTransactionAsync();
            Friendships.RemoveRange(
                Friendships.Where(f => (f.UserId == friendShip.FriendId || f.FriendId == friendShip.FriendId) &&
                                       (f.UserId == friendShip.UserId || f.FriendId == friendShip.UserId))
            );
            await SaveChangesAsync();
            await transaction.CommitAsync();
        }
    }
}