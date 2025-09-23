using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Users.Queries.GetAll
{
    public class GetAllUserQueryHandler(
        IWriteDbContext writeDbContext,
        IMapper mapper
    ) : IRequestHandler<GetAllUserQuery, ReponseListDTO<List<UserDto>>>
    {
        public async Task<ReponseListDTO<List<UserDto>>> Handle(GetAllUserQuery request, CancellationToken cancellationToken)
        {
            var searchTerm = request.searchTerm?.Trim().ToLower();

var users = (await writeDbContext.Users
    .AsNoTracking()
    .ToListAsync(cancellationToken))
    .Where(u => string.IsNullOrEmpty(searchTerm) 
                || u.firstName.ToLower().Contains(searchTerm)
                || u.lastName.ToLower().Contains(searchTerm)
                || u.nickName.ToLower().Contains(searchTerm)
                || u.email.Value.ToLower().Contains(searchTerm))
    .Skip((request.pageNumber - 1) * request.pageSize)
    .Take(request.pageSize)
    .ToList();


            var totalRecords = await writeDbContext.Users.CountAsync(cancellationToken);

            return new ReponseListDTO<List<UserDto>>
            {
                pageNumber = request.pageNumber,
                pageSize = request.pageSize,
                totalRecords = totalRecords,
                data = mapper.Map<List<UserDto>>(users)
            };
        }
    }
}