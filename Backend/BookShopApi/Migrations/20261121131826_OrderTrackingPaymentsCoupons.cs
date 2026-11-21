using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookShopApi.Migrations
{
    /// <inheritdoc />
    public partial class OrderTrackingPaymentsCoupons : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Books_BookId",
                table: "OrderItems");

            migrationBuilder.AddColumn<string>(
                name: "CouponCode",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Courier",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmount",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PaymentReference",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ShippingFee",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Subtotal",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "TrackingNumber",
                table: "Orders",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Code = table.Column<string>(type: "TEXT", nullable: false),
                    PercentOff = table.Column<decimal>(type: "TEXT", nullable: false),
                    FirstOrderOnly = table.Column<bool>(type: "INTEGER", nullable: false),
                    MinSubtotal = table.Column<decimal>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatusHistory",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: true),
                    ChangedBy = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatusHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderStatusHistory_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Coupons",
                columns: new[] { "Id", "Code", "ExpiresAt", "FirstOrderOnly", "IsActive", "MinSubtotal", "PercentOff" },
                values: new object[] { 1, "WELCOME50", null, true, true, 0m, 50m });

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_Code",
                table: "Coupons",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusHistory_OrderId",
                table: "OrderStatusHistory",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Books_BookId",
                table: "OrderItems",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Books_BookId",
                table: "OrderItems");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "OrderStatusHistory");

            migrationBuilder.DropColumn(
                name: "CouponCode",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Courier",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DiscountAmount",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentReference",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ShippingFee",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "Subtotal",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TrackingNumber",
                table: "Orders");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Books_BookId",
                table: "OrderItems",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
