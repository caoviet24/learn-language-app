using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Application.UserActivities.DTOs;
using MediatR;

namespace LearnLanguage.Application.Auth.Queries
{
    [Authorize]
    public class GetMyInfoQuery : IRequest<GetMyInfoDto>
    {

    }

    public class GetMyInfoDto
    {
        public string Id { get; set; } = null!;
        public string email { get; set; } = null!;
        public string nickName { get; set; } = null!;
        public string avatar { get; set; } = null!;
        public string firstName { get; set; } = null!;
        public string lastName { get; set; } = null!;
        public List<UserActivityDTO> userActivities { get; set; } = new List<UserActivityDTO>();
    }
}