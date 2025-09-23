using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Users.Queries.GetAll;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Users.Queries.GetById
{
    public class GetUserByIdQueryHandler(
        IWriteDbContext writeDbContext,
        IMapper mapper
    ) : IRequestHandler<GetUserByIdQuery, UserDto>
    {
        public async Task<UserDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await writeDbContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

            return mapper.Map<UserDto>(user);
        }
    }
}