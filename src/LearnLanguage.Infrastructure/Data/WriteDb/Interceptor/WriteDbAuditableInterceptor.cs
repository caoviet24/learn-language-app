using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using LearnLanguage.Infrastructure.Data.Write;
using LearnLanguage.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Infrastructure.Data.WriteDb.Interceptor
{
    public class WriteDbAuditableInterceptor(IUser user) : SaveChangesInterceptor
    {
         public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            UpdateEntities(eventData.Context);

            return base.SavingChanges(eventData, result);
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            UpdateEntities(eventData.Context);

            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }

        public void UpdateEntities(DbContext context)
        {
            if (context == null) return;

            foreach (var entry in context.ChangeTracker.Entries<BaseAuditableEntity>())
            {
                if (entry.State is EntityState.Added or EntityState.Modified || entry.HasChangedOwnedEntities())

                {
                    if (entry.Entity is BaseAuditableEntity baseEntity)
                    {
                        if (entry.State == EntityState.Added)
                        {
                            baseEntity.Id = Guid.NewGuid().ToString();
                            baseEntity.createdBy = user.getCurrentUser();
                            baseEntity.createdAt = DateTime.UtcNow;
                        }

                        if (entry.State == EntityState.Modified)
                        {
                            baseEntity.updatedBy = user.getCurrentUser();
                            baseEntity.updatedAt = DateTime.UtcNow;
                        }
                    }
                }
            }
        }
    }

    public static class Extensions
    {
        public static bool HasChangedOwnedEntities(this EntityEntry entry) =>
            entry.References.Any(r =>
                r.TargetEntry != null &&
                r.TargetEntry.Metadata.IsOwned() &&
                (r.TargetEntry.State == EntityState.Added || r.TargetEntry.State == EntityState.Modified));
    }
    
}