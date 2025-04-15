using App.Api.Data;
using Microsoft.EntityFrameworkCore;

internal class Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Servislerin eklenmesi
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();




        builder.Services.AddDbContext<AppDbContext>(options =>
        {
            string? connectionString = builder.Configuration.GetConnectionString("Default");
            options.UseSqlServer(connectionString);
        });
        // CORS politikasýný ekleyin
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });
        var app = builder.Build();

       
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();


        app.UseCors("AllowAll");

        app.UseAuthorization();

        app.MapControllers();


        if (app.Environment.IsDevelopment())
        {
            using var scope = app.Services.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await dbContext.Database.EnsureDeletedAsync();
            await dbContext.Database.EnsureCreatedAsync();
            await DbStudentSeed.StudentSeed(dbContext);
        }

        app.Run();
    }
}