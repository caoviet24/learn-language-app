using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Domain.Common;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace LearnLanguage.Infrastructure.Data.Read
{
    public class ReadDbContext(DbContextOptions<ReadDbContext> options) : DbContext(options), IReadDbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Topics> Topics { get; set; }
        public DbSet<Lessons> Lessons { get; set; }
        public DbSet<Levels> Levels { get; set; }
        public DbSet<Word> Words { get; set; }

   

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.email)
                    .HasConversion(
                        email => email.Value,
                        value => new Email(value))
                    .HasMaxLength(255)
                    .IsRequired();

                entity.HasIndex(e => e.email)
                    .IsUnique();

                entity.Property(e => e.password)
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(e => e.firstName)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.lastName)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.nickName)
                    .HasMaxLength(50)
                    .IsRequired(false);

                entity.Property(e => e.role)
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(e => e.isEmailConfirmed)
                    .HasDefaultValue(false);
            });

            modelBuilder.Entity<UserActivity>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.user)
                    .WithMany(u => u.userActivities)
                    .HasForeignKey(e => e.createdBy)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Topics>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.user)
                    .WithMany(u => u.topics)
                    .HasForeignKey(e => e.createdBy)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Levels>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.user)
                    .WithMany(u => u.levels)
                    .HasForeignKey(e => e.createdBy)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Lessons>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.user)
                    .WithMany(u => u.lessons)
                    .HasForeignKey(e => e.createdBy)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasOne(e => e.topic)
                    .WithMany(t => t.lessons)
                    .HasForeignKey(e => e.topicId)
                    .OnDelete(DeleteBehavior.NoAction);

            });


            modelBuilder.Entity<Word>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.topic)
                    .WithMany(t => t.words)
                    .HasForeignKey(e => e.topicId)
                    .OnDelete(DeleteBehavior.NoAction);
                
            });



            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }




        }


        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await base.SaveChangesAsync(cancellationToken);
        }

    }
}