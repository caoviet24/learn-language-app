using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace LearnLanguage.Infrastructure.Data.Write
{
    public class WriteDbContextFactory : IDesignTimeDbContextFactory<WriteDbContext>
    {
        public WriteDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<WriteDbContext>();

            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../LearnLanguage.API"))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
                .Build();

            var connectionString = configuration.GetConnectionString("WriteDb");

            if (string.IsNullOrEmpty(connectionString))
            {
                optionsBuilder.UseInMemoryDatabase("LearnAppDbWrite");
            }
            else
            {
                optionsBuilder.UseSqlServer(connectionString);
            }

            return new WriteDbContext(optionsBuilder.Options);
        }
    }
}