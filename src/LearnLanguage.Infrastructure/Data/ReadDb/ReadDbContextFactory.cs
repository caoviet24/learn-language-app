using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace LearnLanguage.Infrastructure.Data.Read
{
    public class ReadDbContextFactory : IDesignTimeDbContextFactory<ReadDbContext>
    {
        public ReadDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ReadDbContext>();

            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../LearnLanguage.API"))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString("ReadDb");

            if (string.IsNullOrEmpty(connectionString))
            {
                optionsBuilder.UseInMemoryDatabase("LearnAppDbRead");
            }
            else
            {
                optionsBuilder.UseSqlServer(connectionString);
            }

            return new ReadDbContext(optionsBuilder.Options);
        }
    }
}