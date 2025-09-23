using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Users.Queries.GetAll;
using LearnLanguage.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Users.Commands.Update
{
    public class UpdateUserCommandHandler(
        IWriteDbContext writeDbContext,
        IMapper mapper
    ) : IRequestHandler<UpdateUserCommand, ResponseDTO<UserDto>>
    {
        public async Task<ResponseDTO<UserDto>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var checkExitUser = await writeDbContext.Users
        .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

            if (checkExitUser == null)
            {
                return new ResponseDTO<UserDto>
                {
                    data = null,
                    success = false,
                    message = "User not found."
                };
            }

            mapper.Map(request, checkExitUser);

            await writeDbContext.SaveChangesAsync(cancellationToken);

            return new ResponseDTO<UserDto>
            {
                data = mapper.Map<UserDto>(checkExitUser),
                success = true,
                message = "User updated successfully."
            };
        }
    }
}