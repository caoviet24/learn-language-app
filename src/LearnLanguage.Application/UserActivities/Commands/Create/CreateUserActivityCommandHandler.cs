using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.UserActivities.DTOs;
using LearnLanguage.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.UserActivities.Commands.Create
{
    public class CreateUserActivityCommandHandler(
        IReadDbContext readDbContext, IWriteDbContext writeDbContext,
        IMapper mapper,
        IUser user
    ) : IRequestHandler<CreateUserActivityCommand, UserActivityDTO>
    {
        public async Task<UserActivityDTO> Handle(CreateUserActivityCommand request, CancellationToken cancellationToken)
        {
            var isExit = await readDbContext.UserActivities
                .AnyAsync(ua => ua.languageStudying == request.languageStudying && ua.createdBy == user.getCurrentUser(), cancellationToken);

            if (isExit)
            {
                throw new Exception("User activity already exists");
            }

            var newActivity = mapper.Map<UserActivity>(request);

            var result = await writeDbContext.UserActivities.AddAsync(newActivity, cancellationToken);
            await writeDbContext.SaveChangesAsync(cancellationToken);

            if (result == null)
            {
                throw new Exception("Create user activity failed");
            }

            await readDbContext.UserActivities.AddAsync(result.Entity, cancellationToken);
            await readDbContext.SaveChangesAsync(cancellationToken);

            return mapper.Map<UserActivityDTO>(result.Entity);
        }

    }
}
