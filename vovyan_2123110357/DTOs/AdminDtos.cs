using System.Collections.Generic;

namespace vovyan_2123110357.DTOs
{
    public class DashboardResponseDto
    {
        public double RevenueToday { get; set; }
        public int OrderCountToday { get; set; }
        public TableStatusDto TableStatus { get; set; }
        public List<BestSellerDto> BestSellers { get; set; } = new();
    }

    public class TableStatusDto
    {
        public int Empty { get; set; }
        public int Serving { get; set; }
        public int Reserved { get; set; }
    }

    public class BestSellerDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Sold { get; set; }
    }

    public class PagedResultDto<T>
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public List<T> Items { get; set; } = new();
    }

    public class AdminOrderItemDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public double TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AdminCustomerItemDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public int OrderCount { get; set; }
        public double TotalSpent { get; set; }
    }

    public class AdminPaymentItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public double Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime OrderTime { get; set; }
    }

    public class RevenueReportItemDto
    {
        public DateTime Date { get; set; }
        public int OrderCount { get; set; }
        public double Revenue { get; set; }
    }
    public class AdminOrderDetailDto
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? StaffName { get; set; }
        public string? CustomerName { get; set; }
        public int? TableId { get; set; }
        public string? TableCode { get; set; }
        public double TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? DiscountCode { get; set; }
        public double DiscountAmount { get; set; }
        public string? PaymentMethod { get; set; }
        public double Vat { get; set; }
        public double ServiceFee { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<OrderDetailItemDto> Items { get; set; } = new();
    }

    public class OrderDetailItemDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public double Price { get; set; }
    }
}
