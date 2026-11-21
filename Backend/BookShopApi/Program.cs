using System.Text;
using BookShopApi.Data;
using BookShopApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookShopContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.Configure<ShopSettings>(builder.Configuration.GetSection("Shop"));
builder.Services.Configure<PayHereSettings>(builder.Configuration.GetSection("PayHere"));
builder.Services.AddScoped<IPricingService, PricingService>();
builder.Services.AddScoped<IPayHereService, PayHereService>();
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.AddScoped<IEmailSender, EmailSender>();
builder.Services.AddScoped<IOrderNotifier, OrderNotifier>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value!)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
        options.Events = new JwtBearerEvents
        {
            // Tokens last a day; make sure the account still exists, isn't blocked, and has the same role.
            // A blocked or demoted user is signed out on their next request instead of when the token expires.
            OnTokenValidated = async context =>
            {
                var idClaim = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var roleClaim = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
                var db = context.HttpContext.RequestServices.GetRequiredService<BookShopContext>();
                var user = int.TryParse(idClaim, out var userId)
                    ? await db.Users.AsNoTracking().Where(u => u.Id == userId).Select(u => new { u.IsActive, u.Role }).FirstOrDefaultAsync()
                    : null;
                if (user == null || !user.IsActive || user.Role != roleClaim)
                    context.Fail("Account is no longer valid.");
            }
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            // The React app's origin (Shop:FrontendBaseUrl), Vite's default port unless configured
            policy.WithOrigins(builder.Configuration["Shop:FrontendBaseUrl"]?.TrimEnd('/') ?? "http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    SeedData.Initialize(services);
}

app.UseCors("AllowReactApp");

// Serve uploaded payment slips (saved by OrdersController.UploadSlip) at /uploads/...
var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
Directory.CreateDirectory(uploadsRoot);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsRoot),
    RequestPath = "/uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
