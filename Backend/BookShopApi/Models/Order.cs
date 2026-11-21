using System.Text.Json.Serialization;

namespace BookShopApi.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [JsonIgnore]
    public User User { get; set; } = null!;

    // Price breakdown. TotalAmount = Subtotal - DiscountAmount + ShippingFee
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal ShippingFee { get; set; }
    public string? CouponCode { get; set; }
    public decimal TotalAmount { get; set; }

    // See OrderStatuses
    public string OrderStatus { get; set; } = OrderStatuses.PendingApproval;

    // See PaymentStatuses
    public string PaymentStatus { get; set; } = PaymentStatuses.Unpaid;
    // Gateway payment id (PayHere payment_id)
    public string? PaymentReference { get; set; }

    public string? RejectionReason { get; set; }

    public string? Courier { get; set; }
    public string? TrackingNumber { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = new List<OrderItem>();

    public DeliveryDetails DeliveryDetails { get; set; } = null!;

    public List<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();

    /// <summary>Changes the order status and records it in the history.</summary>
    public void SetStatus(string status, string changedBy, string? note = null)
    {
        OrderStatus = status;
        LastUpdated = DateTime.UtcNow;
        StatusHistory.Add(new OrderStatusHistory
        {
            Status = status,
            ChangedBy = changedBy,
            Note = note,
            CreatedAt = LastUpdated
        });
    }

    /// <summary>Records a note in the history without changing the status (e.g. payment events).</summary>
    public void AddNote(string changedBy, string note)
    {
        LastUpdated = DateTime.UtcNow;
        StatusHistory.Add(new OrderStatusHistory
        {
            Status = OrderStatus,
            ChangedBy = changedBy,
            Note = note,
            CreatedAt = LastUpdated
        });
    }
}

public static class OrderStatuses
{
    public const string AwaitingPayment = "AwaitingPayment"; // online payment started, not confirmed yet
    public const string PendingApproval = "PendingApproval";
    public const string Approved = "Approved";
    public const string Processing = "Processing";
    public const string Shipped = "Shipped";
    public const string OutForDelivery = "OutForDelivery";
    public const string Delivered = "Delivered";
    public const string Cancelled = "Cancelled";
    public const string Rejected = "Rejected";

    public static readonly HashSet<string> Closed = new() { Delivered, Cancelled, Rejected };
    // Orders that don't count towards revenue
    public static readonly HashSet<string> NotBooked = new() { AwaitingPayment, Cancelled, Rejected };
}

public static class PaymentStatuses
{
    public const string Unpaid = "Unpaid";             // COD before delivery, bank transfer before slip is verified
    public const string Pending = "Pending";           // waiting for gateway confirmation
    public const string Paid = "Paid";
    public const string Failed = "Failed";
    public const string RefundDue = "RefundDue";       // paid, but the order was cancelled/rejected
    public const string Refunded = "Refunded";
    public const string ChargedBack = "ChargedBack";
}

public static class PaymentMethods
{
    public const string CashOnDelivery = "COD";
    public const string BankTransfer = "Bank";
    public const string PayHere = "PayHere";

    public static readonly HashSet<string> All = new() { CashOnDelivery, BankTransfer, PayHere };
}
