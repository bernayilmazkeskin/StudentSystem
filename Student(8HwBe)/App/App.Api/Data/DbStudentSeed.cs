using App.Api.Data.Entities;

namespace App.Api.Data
{
    public static class DbStudentSeed
    {
        public static async Task StudentSeed(AppDbContext context)
        {
            var students = new List<StudentEntity>
    {
        new StudentEntity
        {
            FirstName = "Ali",
            LastName = "Yılmaz",
            Class = "2/G",
            StudentNumber = "12233"
        },
        new StudentEntity
        {
            FirstName = "Ahmet",
            LastName = "Demir",
            Class = "3/A",
            StudentNumber = "12354"
        },
        new StudentEntity
        {
            FirstName = "Ayşe",
            LastName = "Kaya",
            Class = "1/B",
            StudentNumber = "12434"
        }
    };
            await context.Students.AddRangeAsync(students);
            await context.SaveChangesAsync();
        }
    }
}
