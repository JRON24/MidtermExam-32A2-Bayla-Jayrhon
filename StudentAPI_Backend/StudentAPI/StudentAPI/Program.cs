using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StudentAPI.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ✅ Clear default logging providers and add console logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// ✅ Register DbContext with SQL Server connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Add controller services with JSON options for reference loops and pretty printing
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// ✅ Configure CORS to allow requests from your frontend (localhost:3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ✅ Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Student API", Version = "v1" });
});

var app = builder.Build();

// ✅ Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Student API v1");
    });
}

// ✅ Global exception handler (to catch unhandled exceptions globally)
app.UseExceptionHandler("/error");

// ✅ Use CORS before routing or authorization
app.UseCors("AllowFrontend");

// ✅ Redirect HTTP to HTTPS if necessary (optional)
app.UseHttpsRedirection();

// ✅ Authorization middleware (for future authentication support)
app.UseAuthorization();

// ✅ Map controllers to routes
app.MapControllers();

// ✅ Run the application
app.Run();
