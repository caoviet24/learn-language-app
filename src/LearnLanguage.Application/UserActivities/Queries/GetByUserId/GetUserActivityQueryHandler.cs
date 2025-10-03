using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.UserActivities.DTOs;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.UserActivities.Queries.GetByUserId
{
    public class GetUserActivityQueryHandler(
        IReadDbContext context,
        IMapper mapper,
        IUser user
    ) : IRequestHandler<GetUserActivityQuery, List<UserActivityDTO>>
    {
        public async Task<List<UserActivityDTO>> Handle(GetUserActivityQuery request, CancellationToken cancellationToken)
        {

            var userActivities = await context.UserActivities
                .Where(ua => ua.createdBy == user.getCurrentUser())
                .ToListAsync(cancellationToken);

            return mapper.Map<List<UserActivityDTO>>(userActivities);
        }
    }
}