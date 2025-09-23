using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace LearnLanguage.Application.Auth.Queries
{
    public class GetMyInfoQueryHandler(
        IMapper mapper,
        IReadDbContext readDbContext,
        IUser user,
        ILogger<GetMyInfoQueryHandler> logger
    ) : IRequestHandler<GetMyInfoQuery, GetMyInfoDto>
    {
        public Task<GetMyInfoDto> Handle(GetMyInfoQuery request, CancellationToken cancellationToken)
        {
            var userId = user.getCurrentUser();
            if (userId == null)
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            logger.LogInformation("Fetching user info for user ID: {UserId}", userId);

            var userEntity = readDbContext.Users.FirstOrDefault(u => u.Id == userId);
            if (userEntity == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            var userDto = mapper.Map<GetMyInfoDto>(userEntity);
            return Task.FromResult(userDto);
        }
    }
}