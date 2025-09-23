using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace LearnLanguage.Application.Common.Interfaces
{
    public interface IWriteDbContext : IDisposable
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Topics> Topics { get; set; }
        public DbSet<Lessons> Lessons { get; set; }
        public DbSet<Levels> Levels { get; set; }
        public DbSet<Excercises> Excercises { get; set; }
        public DbSet<ExcerciseTrueFalse> ExcerciseTrueFalses { get; set; }
        public DbSet<ExcersiteFillBlank> ExcersiteFillBlanks { get; set; }
        public DbSet<ExcerciseMatch> ExcerciseMatches { get; set; }

        DatabaseFacade Database { get; }
        EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}