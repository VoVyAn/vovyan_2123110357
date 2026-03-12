using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using vovyan_2123110357.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<vovyan_2123110357Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("vovyan_2123110357Context") ?? throw new InvalidOperationException("Connection string 'vovyan_2123110357Context' not found.")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
