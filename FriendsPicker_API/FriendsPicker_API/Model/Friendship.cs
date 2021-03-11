using System;
using System.Runtime.InteropServices;

namespace FriendsPicker_API.Model
{
    public class Friendship
    {
        public int Id { get; set; }

        public String UserId { get; set; }

        public String FriendId { get; set; }
    }
}