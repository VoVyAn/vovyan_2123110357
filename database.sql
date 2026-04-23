-- Tạo database
CREATE DATABASE vovyan_aspnet;
GO

USE vovyan_aspnet;
GO

-- 1. Bảng Categories
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(MAX) NOT NULL
);

-- 2. Bảng Products
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CategoryId INT NOT NULL,
    Name NVARCHAR(MAX) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Price FLOAT NOT NULL,
    Quantity INT NOT NULL,
    ImageUrl NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE NO ACTION
);

-- 3. Bảng ProductDetails
CREATE TABLE ProductDetails (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ProductId INT NOT NULL,
    Color NVARCHAR(MAX) NOT NULL,
    Size NVARCHAR(MAX) NOT NULL,
    Stock INT NOT NULL,
    ImageUrl NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_ProductDetails_Products FOREIGN KEY (ProductId) REFERENCES Products(Id) ON DELETE CASCADE
);

-- 4. Bảng Users
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(MAX) NOT NULL,
    Password NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(MAX) NOT NULL
);

-- 5. Bảng Carts
CREATE TABLE Carts (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL UNIQUE,
    CONSTRAINT FK_Carts_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 6. Bảng CartItems
CREATE TABLE CartItems (
    Id INT PRIMARY KEY IDENTITY(1,1),
    CartId INT NOT NULL,
    ProductDetailId INT NOT NULL,
    Quantity INT NOT NULL,
    CONSTRAINT FK_CartItems_Carts FOREIGN KEY (CartId) REFERENCES Carts(Id) ON DELETE CASCADE
);

-- 7. Bảng Menus
CREATE TABLE Menus (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(MAX) NOT NULL,
    Url NVARCHAR(MAX) NOT NULL
);

-- 8. Bảng Orders
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    TotalAmount FLOAT NOT NULL,
    Status NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 9. Bảng OrderDetails
CREATE TABLE OrderDetails (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    ProductDetailId INT NOT NULL,
    Quantity INT NOT NULL,
    Price FLOAT NOT NULL,
    CONSTRAINT FK_OrderDetails_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE
);

-- 10. Bảng Payments
CREATE TABLE Payments (
    Id INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    Method NVARCHAR(MAX) NOT NULL,
    Status NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE
);

-- 11. Bảng RestaurantTables
CREATE TABLE RestaurantTables (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Code NVARCHAR(MAX) NOT NULL,
    Capacity INT NOT NULL,
    Status NVARCHAR(MAX) NOT NULL,
    Note NVARCHAR(MAX) NULL
);

-- 12. Bảng SystemSettings
CREATE TABLE SystemSettings (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RestaurantName NVARCHAR(MAX) NOT NULL,
    Address NVARCHAR(MAX) NOT NULL,
    Phone NVARCHAR(MAX) NOT NULL,
    OpenHours NVARCHAR(MAX) NOT NULL,
    Theme NVARCHAR(MAX) NOT NULL
);
GO

-- Chèn dữ liệu mẫu (Seed Data)
INSERT INTO Categories (Name) VALUES (N'Món khai vị'), (N'Món chính'), (N'Đồ uống'), (N'Tráng miệng');

-- Giả sử ID của Categories là 1, 2, 3, 4
INSERT INTO Products (CategoryId, Name, Description, Price, Quantity, ImageUrl)
VALUES 
(1, N'Salad cá ngừ', N'Salad rau trộn cá ngừ sốt mè', 59000, 120, 'https://picsum.photos/seed/saladcangu/400/300'),
(1, N'Súp bí đỏ', N'Súp bí đỏ kèm bánh mì nướng', 49000, 100, 'https://picsum.photos/seed/supbido/400/300'),
(2, N'Bò lúc lắc', N'Bò lúc lắc ăn kèm khoai tây chiên', 139000, 80, 'https://picsum.photos/seed/boluclac/400/300'),
(2, N'Cơm gà nướng', N'Cơm gà nướng sốt tiêu đen', 89000, 150, 'https://picsum.photos/seed/comganuong/400/300'),
(2, N'Mì ý sốt bò băm', N'Mì ý sốt cà chua bò băm', 99000, 120, 'https://picsum.photos/seed/miyboba/400/300'),
(3, N'Trà đào cam sả', N'Trà đào nhiệt đới mát lạnh', 39000, 200, 'https://picsum.photos/seed/tradaocamsa/400/300'),
(3, N'Cà phê sữa đá', N'Cà phê rang xay đậm vị', 32000, 220, 'https://picsum.photos/seed/caphesuada/400/300'),
(4, N'Bánh flan', N'Bánh flan mềm mịn caramel', 29000, 140, 'https://picsum.photos/seed/banhflan/400/300');

-- Giả sử ID của Products là 1 đến 8
INSERT INTO ProductDetails (ProductId, Color, Size, Stock, ImageUrl)
VALUES 
(1, 'Standard', 'Regular', 60, 'https://picsum.photos/seed/saladcangu/400/300'),
(1, 'Standard', 'Large', 60, 'https://picsum.photos/seed/saladcangu/400/300'),
(2, 'Standard', 'Regular', 100, 'https://picsum.photos/seed/supbido/400/300'),
(3, 'Standard', 'Regular', 40, 'https://picsum.photos/seed/boluclac/400/300'),
(3, 'Standard', 'Large', 40, 'https://picsum.photos/seed/boluclac/400/300'),
(4, 'Standard', 'Regular', 80, 'https://picsum.photos/seed/comganuong/400/300'),
(5, 'Standard', 'Regular', 70, 'https://picsum.photos/seed/miyboba/400/300'),
(6, 'Ice', 'M', 100, 'https://picsum.photos/seed/tradaocamsa/400/300'),
(6, 'Ice', 'L', 100, 'https://picsum.photos/seed/tradaocamsa/400/300'),
(7, 'Ice', 'M', 110, 'https://picsum.photos/seed/caphesuada/400/300'),
(8, 'Standard', 'Regular', 140, 'https://picsum.photos/seed/banhflan/400/300');

INSERT INTO Users (Username, Password, Role)
VALUES 
('admin', 'admin123', 'Admin'),
('cashier', 'cashier123', 'User'),
('guest01', '123456', 'User');

INSERT INTO Menus (Name, Url)
VALUES 
(N'Trang chủ', '/'),
(N'Món ăn', '/foods'),
(N'Đặt bàn', '/booking'),
(N'Thanh toán', '/checkout');

INSERT INTO RestaurantTables (Code, Capacity, Status)
VALUES 
('A01', 2, 'Empty'),
('A02', 2, 'Serving'),
('B01', 4, 'Reserved'),
('B02', 4, 'Empty'),
('C01', 6, 'Serving'),
('VIP1', 8, 'Reserved');

INSERT INTO SystemSettings (RestaurantName, Address, Phone, OpenHours, Theme)
VALUES 
('F&B Restaurant', '123 Nguyen Trai, Ha Noi', '0900000000', '09:00 - 22:00', 'DarkBlue');
