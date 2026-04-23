using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;
using vovyan_2123110357.Data;
using vovyan_2123110357.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});



builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                k => k.Key,
                v => v.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
            );

        return new BadRequestObjectResult(new
        {
            statusCode = StatusCodes.Status400BadRequest,
            error = "ValidationError",
            message = "Invalid request data.",
            details = errors
        });
    };
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<JWTservice>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<MenuService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<DiscountService>();

// JWT
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "THIS_IS_A_FALLBACK_SECRET_KEY_CHANGE_ME_123456";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "vovyan-api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "vovyan-client";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = async context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                statusCode = 401,
                error = "Unauthorized",
                message = "Missing or invalid access token."
            }));
        },
        OnForbidden = async context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                statusCode = 403,
                error = "Forbidden",
                message = "You do not have permission to access this resource."
            }));
        }
    };
});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    
    // Ensure FullName column exists and admin has correct role
    try {
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'FullName') ALTER TABLE dbo.Users ADD FullName NVARCHAR(MAX) NULL;");
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Users') AND name = 'Code') ALTER TABLE dbo.Users ADD Code NVARCHAR(MAX) NULL;");
        
        // Force admin user to have Admin role to avoid 403 errors
        dbContext.Database.ExecuteSqlRaw("UPDATE dbo.Users SET Role = 'Admin' WHERE Username = 'admin';");
        
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'Vat') ALTER TABLE dbo.Orders ADD Vat FLOAT DEFAULT 0 NOT NULL;");
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Orders') AND name = 'ServiceFee') ALTER TABLE dbo.Orders ADD ServiceFee FLOAT DEFAULT 0 NOT NULL;");
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Reservations') AND name = 'StoreName') ALTER TABLE dbo.Reservations ADD StoreName NVARCHAR(MAX) NULL;");
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Reservations') AND name = 'Status') ALTER TABLE dbo.Reservations ADD Status NVARCHAR(MAX) DEFAULT 'Pending' NOT NULL;");
        dbContext.Database.ExecuteSqlRaw("IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Reservations') AND name = 'CreatedAt') ALTER TABLE dbo.Reservations ADD CreatedAt DATETIME DEFAULT GETDATE() NOT NULL;");

        // FIX: Convert absolute localhost image URLs to relative paths
        dbContext.Database.ExecuteSqlRaw(@"
            UPDATE dbo.Products 
            SET ImageUrl = '/uploads/' + REVERSE(SUBSTRING(REVERSE(ImageUrl), 1, CHARINDEX('/', REVERSE(ImageUrl)) - 1))
            WHERE ImageUrl LIKE 'http%://%/uploads/%';
            
            UPDATE dbo.ProductDetails 
            SET ImageUrl = '/uploads/' + REVERSE(SUBSTRING(REVERSE(ImageUrl), 1, CHARINDEX('/', REVERSE(ImageUrl)) - 1))
            WHERE ImageUrl LIKE 'http%://%/uploads/%';
        ");
    } catch (Exception ex) {
        Console.WriteLine("⚠️ Database update warning: " + ex.Message);
    }

    try
    {
        DatabaseSeeder.Seed(dbContext);
    }
    catch (Exception ex)
    {
        Console.WriteLine("❌ Seed lỗi: " + ex.Message);
    }
}


app.UseSwagger();
app.UseSwaggerUI();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            statusCode = 500,
            error = "InternalServerError",
            message = "An unexpected error occurred."
        }));
    });
});

app.UseStatusCodePages(async statusContext =>
{
    var response = statusContext.HttpContext.Response;

    if (response.HasStarted) return;

    if (response.StatusCode == 404)
    {
        response.ContentType = "application/json";
        await response.WriteAsync(JsonSerializer.Serialize(new
        {
            statusCode = 404,
            error = "NotFound",
            message = "Resource not found."
        }));
    }
});

app.UseCors("AllowAll");

app.UseStaticFiles(); // Serves files from wwwroot

// Ensure uploads folder exists in wwwroot
var uploadsPath = Path.Combine(app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot"), "uploads");
if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

app.UseAuthentication();
app.UseAuthorization();



app.MapGet("/", () => "API is running...");


app.MapControllers();

app.Run();