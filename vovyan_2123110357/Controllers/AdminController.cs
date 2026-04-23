using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.DTOs;
using vovyan_2123110357.Data;
using vovyan_2123110357.Models;

namespace vovyan_2123110357.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            var today = DateTime.Today;
            var todayOrders = _context.Orders.Count(o => o.CreatedAt >= today);
            var todayRevenue = _context.Orders
                .Where(o => o.CreatedAt >= today && o.Status == "Completed")
                .Sum(o => (double?)o.TotalAmount) ?? 0;

            var tableStats = new TableStatusDto
            {
                Empty = _context.RestaurantTables.Count(t => t.Status == "Empty"),
                Serving = _context.RestaurantTables.Count(t => t.Status == "Serving"),
                Reserved = _context.RestaurantTables.Count(t => t.Status == "Reserved")
            };

            var bestSeller = _context.OrderDetails
                .Join(_context.ProductDetails, od => od.ProductDetailId, pd => pd.Id, (od, pd) => new { od, pd.ProductId })
                .Join(_context.Products, x => x.ProductId, p => p.Id, (x, p) => new { p.Name, x.od.Quantity })
                .GroupBy(x => x.Name)
                .Select(g => new BestSellerDto { ProductName = g.Key, Sold = g.Sum(x => x.Quantity) })
                .OrderByDescending(x => x.Sold)
                .Take(5)
                .ToList();

            var response = new DashboardResponseDto
            {
                RevenueToday = todayRevenue,
                OrderCountToday = todayOrders,
                TableStatus = tableStats,
                BestSellers = bestSeller
            };

            return Ok(response);
        }

        [HttpGet("orders")]
        public IActionResult GetOrders([FromQuery] string? status, [FromQuery] string? q, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var ordersQuery = _context.Orders.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                ordersQuery = ordersQuery.Where(o => o.Status == status);
            }

            if (!string.IsNullOrWhiteSpace(q) && int.TryParse(q, out var userId))
            {
                ordersQuery = ordersQuery.Where(o => o.UserId == userId);
            }

            var totalItems = ordersQuery.Count();
            var items = ordersQuery
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new AdminOrderItemDto
                {
                    Id = o.Id,
                    UserId = o.UserId,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    CreatedAt = o.CreatedAt
                })
                .ToList();

            return Ok(new PagedResultDto<AdminOrderItemDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = items
            });
        }

        [HttpPut("orders/{id}/status")]
        public IActionResult UpdateOrderStatus(int id, [FromQuery] string status)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            order.Status = status;
            _context.SaveChanges();
            return Ok(order);
        }

        [HttpGet("tables")]
        public IActionResult GetTables() => Ok(_context.RestaurantTables.OrderBy(t => t.Code).ToList());

        [HttpPost("tables")]
        public IActionResult CreateTable(RestaurantTable table)
        {
            _context.RestaurantTables.Add(table);
            _context.SaveChanges();
            return Ok(table);
        }

        [HttpPut("tables/{id}")]
        public IActionResult UpdateTable(int id, RestaurantTable table)
        {
            var existing = _context.RestaurantTables.Find(id);
            if (existing == null) return NotFound();

            existing.Code = table.Code;
            existing.Capacity = table.Capacity;
            existing.Status = table.Status;
            existing.Note = table.Note;
            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("tables/{id}")]
        public IActionResult DeleteTable(int id)
        {
            var existing = _context.RestaurantTables.Find(id);
            if (existing == null) return NotFound();
            _context.RestaurantTables.Remove(existing);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            return Ok(_context.Users.ToList());
        }

        [HttpPost("users")]
        public IActionResult CreateUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }

        [HttpPut("users/{id}")]
        public IActionResult UpdateUser(int id, User updated)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            user.Username = updated.Username;
            if (!string.IsNullOrEmpty(updated.Password))
                user.Password = updated.Password;
            user.Role = updated.Role;
            user.Code = updated.Code;

            _context.SaveChanges();
            return Ok(user);
        }

        [HttpDelete("users/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("customers")]
        public IActionResult GetCustomers([FromQuery] string? q, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var query = _context.Users
                .Where(u => u.Role != "Admin")
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                var search = q.Trim().ToLower();
                query = query.Where(u => u.Username.ToLower().Contains(search));
            }

            var totalItems = query.Count();
            var customers = query
                .OrderBy(u => u.Username)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new AdminCustomerItemDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    OrderCount = _context.Orders.Count(o => o.UserId == u.Id),
                    TotalSpent = _context.Orders.Where(o => o.UserId == u.Id && o.Status == "Completed").Sum(o => (double?)o.TotalAmount) ?? 0
                })
                .ToList();

            return Ok(new PagedResultDto<AdminCustomerItemDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = customers
            });
        }

        [HttpGet("payments")]
        public IActionResult GetPayments([FromQuery] string? method, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var query = _context.Payments
                .Join(_context.Orders, p => p.OrderId, o => o.Id, (p, o) => new
                {
                    p.Id,
                    p.OrderId,
                    Amount = o.TotalAmount,
                    p.Method,
                    p.Status,
                    OrderTime = o.CreatedAt
                }).AsQueryable();

            if (!string.IsNullOrWhiteSpace(method))
            {
                query = query.Where(x => x.Method == method);
            }

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(x => x.Status == status);
            }

            var totalItems = query.Count();
            var payments = query
                .OrderByDescending(x => x.OrderTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new AdminPaymentItemDto
                {
                    Id = x.Id,
                    OrderId = x.OrderId,
                    Amount = x.Amount,
                    Method = x.Method,
                    Status = x.Status,
                    OrderTime = x.OrderTime
                })
                .ToList();

            return Ok(new PagedResultDto<AdminPaymentItemDto>
            {
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                Items = payments
            });
        }

        [HttpGet("reports/revenue")]
        public IActionResult RevenueReport([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var fromDate = from ?? DateTime.Today.AddDays(-30);
            var toDate = to ?? DateTime.Today.AddDays(1).AddTicks(-1);

            var data = _context.Orders
                .Where(o => o.CreatedAt >= fromDate && o.CreatedAt <= toDate && o.Status == "Completed")
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new RevenueReportItemDto
                {
                    Date = g.Key,
                    OrderCount = g.Count(),
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToList();

            return Ok(data);
        }

        [HttpGet("settings")]
        public IActionResult GetSettings()
        {
            var setting = _context.SystemSettings.FirstOrDefault();
            return Ok(setting);
        }

        [HttpPut("settings")]
        public IActionResult UpdateSettings(SystemSetting input)
        {
            var setting = _context.SystemSettings.FirstOrDefault();
            if (setting == null)
            {
                _context.SystemSettings.Add(input);
                _context.SaveChanges();
                return Ok(input);
            }

            setting.RestaurantName = input.RestaurantName;
            setting.Address = input.Address;
            setting.Phone = input.Phone;
            setting.OpenHours = input.OpenHours;
            setting.Theme = input.Theme;
            _context.SaveChanges();
            return Ok(setting);
        }
    }
}
