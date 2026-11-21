using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookShopApi.Migrations
{
    /// <inheritdoc />
    public partial class BackfillOrderTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Existing orders had no discounts or shipping, so subtotal = total
            migrationBuilder.Sql("UPDATE Orders SET Subtotal = TotalAmount WHERE CAST(Subtotal AS REAL) = 0;");
            // Delivered orders and accepted card/bank orders count as paid; everything else is unpaid
            migrationBuilder.Sql(@"UPDATE Orders SET PaymentStatus = CASE
                WHEN OrderStatus = 'Delivered' THEN 'Paid'
                WHEN Id IN (SELECT OrderId FROM DeliveryDetails WHERE PaymentMethod IN ('Card','Bank'))
                     AND OrderStatus NOT IN ('PendingApproval','Rejected','Cancelled') THEN 'Paid'
                ELSE 'Unpaid' END
                WHERE PaymentStatus = '';");
            // Some old rows never had LastUpdated set
            migrationBuilder.Sql("UPDATE Orders SET LastUpdated = CreatedAt WHERE LastUpdated < '1900-01-01';");
            // Give every existing order a starting point in its timeline
            migrationBuilder.Sql(@"INSERT INTO OrderStatusHistory (OrderId, Status, Note, ChangedBy, CreatedAt)
                SELECT Id, OrderStatus, 'Status before order tracking was introduced', 'System', LastUpdated FROM Orders
                WHERE Id NOT IN (SELECT OrderId FROM OrderStatusHistory);");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
