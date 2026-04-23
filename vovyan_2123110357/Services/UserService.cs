using vovyan_2123110357.Data;
using vovyan_2123110357.Models;

namespace vovyan_2123110357.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public User Register(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public List<User> GetAll() => _context.Users.ToList();

        public User Update(int id, User updated)
        {
            var user = _context.Users.Find(id);
            if (user == null) return null;

            user.Username = updated.Username;
            if (!string.IsNullOrEmpty(updated.Password))
                user.Password = updated.Password;
            user.Role = updated.Role;
            user.Code = updated.Code;

            _context.SaveChanges();
            return user;
        }

        public bool Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return false;
            _context.Users.Remove(user);
            _context.SaveChanges();
            return true;
        }

        public User Login(string username, string password)

        {
            return _context.Users
                .FirstOrDefault(u => u.Username == username && u.Password == password);
        }
    }
}