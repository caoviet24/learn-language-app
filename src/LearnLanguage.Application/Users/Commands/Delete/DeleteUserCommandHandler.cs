using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Users.Queries.GetAll;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Users.Commands.Delete
{
    public class DeleteUserCommandHandler
    (
        IWriteDbContext writeDbContext,
        IMapper mapper
    ) : IRequestHandler<DeleteUserCommand, ResponseDTO<UserDto>>
    {
        public async Task<ResponseDTO<UserDto>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var user = await writeDbContext.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

            if (user == null)
            {
                return new ResponseDTO<UserDto>
                {
                    success = false,
                    message = "User not found.",
                    data = null
                };
            }

            writeDbContext.Users.Remove(user);
            await writeDbContext.SaveChangesAsync(cancellationToken);

            return new ResponseDTO<UserDto>
            {
                success = true,
                message = "User deleted successfully.",
                data = mapper.Map<UserDto>(user)
            };
        }
    }
}