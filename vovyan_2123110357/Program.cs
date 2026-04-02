using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using vovyan_2123110357.Data;
using vovyan_2123110357.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
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

// Services
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<JWTservice>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<MenuService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderService>();

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
                statusCode = StatusCodes.Status401Unauthorized,
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
                statusCode = StatusCodes.Status403Forbidden,
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
    DatabaseSeeder.Seed(dbContext);
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            statusCode = StatusCodes.Status500InternalServerError,
            error = "InternalServerError",
            message = "An unexpected error occurred."
        }));
    });
});
app.UseStatusCodePages(async statusContext =>
{
    var response = statusContext.HttpContext.Response;
    if (response.HasStarted) return;
    if (response.StatusCode == StatusCodes.Status404NotFound)
    {
        response.ContentType = "application/json";
        await response.WriteAsync(JsonSerializer.Serialize(new
        {
            statusCode = StatusCodes.Status404NotFound,
            error = "NotFound",
            message = "Resource not found."
        }));
    }
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();