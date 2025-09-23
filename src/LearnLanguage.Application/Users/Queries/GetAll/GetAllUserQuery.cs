using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Domain.Common;
using MediatR;

namespace LearnLanguage.Application.Users.Queries.GetAll
{
    public class GetAllUserQuery : IRequest<ReponseListDTO<List<UserDto>>>
    {
        public int pageNumber { get; set; } = 1;
        public int pageSize { get; set; } = 10;
        public string? searchTerm { get; set; } = null;
    }

    public class UserDto : BaseEntity
    {
        public string email { get; set; } = null!;
        public string password { get; set; } = null!;
        public string firstName { get; set; } = null!;
        public string lastName { get; set; } = null!;
        public string nickName { get; set; } = null!;
        public string role { get; set; } = null!;
    }
}