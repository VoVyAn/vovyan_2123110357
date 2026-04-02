using vovyan_2123110357.Models;

namespace vovyan_2123110357.Data
{
    public static class DatabaseSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Categories.Any() || context.Products.Any())
            {
                return;
            }

            var categories = new List<Category>
            {
                new() { Name = "Mon khai vi" },
                new() { Name = "Mon chinh" },
                new() { Name = "Do uong" },
                new() { Name = "Trang mieng" }
            };
            context.Categories.AddRange(categories);
            context.SaveChanges();

            var products = new List<Product>
            {
                new() { CategoryId = categories[0].Id, Name = "Salad ca ngu", Description = "Salad rau tron ca ngu sot me", Price = 59000, Quantity = 120, ImageUrl = "https://picsum.photos/seed/saladcangu/400/300" },
                new() { CategoryId = categories[0].Id, Name = "Sup bi do", Description = "Sup bi do kem banh mi nuong", Price = 49000, Quantity = 100, ImageUrl = "https://picsum.photos/seed/supbido/400/300" },
                new() { CategoryId = categories[1].Id, Name = "Bo luc lac", Description = "Bo luc lac an kem khoai tay chien", Price = 139000, Quantity = 80, ImageUrl = "https://picsum.photos/seed/boluclac/400/300" },
                new() { CategoryId = categories[1].Id, Name = "Com ga nuong", Description = "Com ga nuong sot tieu den", Price = 89000, Quantity = 150, ImageUrl = "https://picsum.photos/seed/comganuong/400/300" },
                new() { CategoryId = categories[1].Id, Name = "Mi y sot bo bam", Description = "Mi y sot ca chua bo bam", Price = 99000, Quantity = 120, ImageUrl = "https://picsum.photos/seed/miyboba/400/300" },
                new() { CategoryId = categories[2].Id, Name = "Tra dao cam sa", Description = "Tra dao nhiet doi mat lanh", Price = 39000, Quantity = 200, ImageUrl = "https://picsum.photos/seed/tradaocamsa/400/300" },
                new() { CategoryId = categories[2].Id, Name = "Ca phe sua da", Description = "Ca phe rang xay dam vi", Price = 32000, Quantity = 220, ImageUrl = "https://picsum.photos/seed/caphesuada/400/300" },
                new() { CategoryId = categories[3].Id, Name = "Banh flan", Description = "Banh flan mem min caramel", Price = 29000, Quantity = 140, ImageUrl = "https://picsum.photos/seed/banhflan/400/300" }
            };
            context.Products.AddRange(products);
            context.SaveChanges();

            var details = new List<ProductDetail>
            {
                new() { ProductId = products[0].Id, Color = "Standard", Size = "Regular", Stock = 60, ImageUrl = products[0].ImageUrl },
                new() { ProductId = products[0].Id, Color = "Standard", Size = "Large", Stock = 60, ImageUrl = products[0].ImageUrl },
                new() { ProductId = products[1].Id, Color = "Standard", Size = "Regular", Stock = 100, ImageUrl = products[1].ImageUrl },
                new() { ProductId = products[2].Id, Color = "Standard", Size = "Regular", Stock = 40, ImageUrl = products[2].ImageUrl },
                new() { ProductId = products[2].Id, Color = "Standard", Size = "Large", Stock = 40, ImageUrl = products[2].ImageUrl },
                new() { ProductId = products[3].Id, Color = "Standard", Size = "Regular", Stock = 80, ImageUrl = products[3].ImageUrl },
                new() { ProductId = products[4].Id, Color = "Standard", Size = "Regular", Stock = 70, ImageUrl = products[4].ImageUrl },
                new() { ProductId = products[5].Id, Color = "Ice", Size = "M", Stock = 100, ImageUrl = products[5].ImageUrl },
                new() { ProductId = products[5].Id, Color = "Ice", Size = "L", Stock = 100, ImageUrl = products[5].ImageUrl },
                new() { ProductId = products[6].Id, Color = "Ice", Size = "M", Stock = 110, ImageUrl = products[6].ImageUrl },
                new() { ProductId = products[7].Id, Color = "Standard", Size = "Regular", Stock = 140, ImageUrl = products[7].ImageUrl }
            };
            context.ProductDetails.AddRange(details);

            var menus = new List<Menu>
            {
                new() { Name = "Trang chu", Url = "/" },
                new() { Name = "Mon an", Url = "/foods" },
                new() { Name = "Dat ban", Url = "/booking" },
                new() { Name = "Thanh toan", Url = "/checkout" }
            };
            context.Menus.AddRange(menus);

            var users = new List<User>
            {
                new() { Username = "admin", Password = "admin123", Role = "Admin" },
                new() { Username = "cashier", Password = "cashier123", Role = "User" },
                new() { Username = "guest01", Password = "123456", Role = "User" }
            };
            context.Users.AddRange(users);

            var tables = new List<RestaurantTable>
            {
                new() { Code = "A01", Capacity = 2, Status = "Empty" },
                new() { Code = "A02", Capacity = 2, Status = "Serving" },
                new() { Code = "B01", Capacity = 4, Status = "Reserved" },
                new() { Code = "B02", Capacity = 4, Status = "Empty" },
                new() { Code = "C01", Capacity = 6, Status = "Serving" },
                new() { Code = "VIP1", Capacity = 8, Status = "Reserved" }
            };
            context.RestaurantTables.AddRange(tables);

            var setting = new SystemSetting
            {
                RestaurantName = "F&B Restaurant",
                Address = "123 Nguyen Trai, Ha Noi",
                Phone = "0900000000",
                OpenHours = "09:00 - 22:00",
                Theme = "DarkBlue"
            };
            context.SystemSettings.Add(setting);

            context.SaveChanges();

            var guest = users.First(u => u.Username == "guest01");
            var sampleOrder = new Order
            {
                UserId = guest.Id,
                TotalAmount = 0,
                Status = "Completed",
                CreatedAt = DateTime.Now.AddHours(-2)
            };
            context.Orders.Add(sampleOrder);
            context.SaveChanges();

            var firstDetail = details[0];
            var secondDetail = details[3];
            var od1 = new OrderDetail
            {
                OrderId = sampleOrder.Id,
                ProductDetailId = firstDetail.Id,
                Quantity = 2,
                Price = products[0].Price
            };
            var od2 = new OrderDetail
            {
                OrderId = sampleOrder.Id,
                ProductDetailId = secondDetail.Id,
                Quantity = 1,
                Price = products[2].Price
            };
            context.OrderDetails.AddRange(od1, od2);
            sampleOrder.TotalAmount = (od1.Quantity * od1.Price) + (od2.Quantity * od2.Price);
            context.SaveChanges();

            context.Payments.Add(new Payment
            {
                OrderId = sampleOrder.Id,
                Method = "Cash",
                Status = "Paid"
            });
            context.SaveChanges();
        }
    }
}
