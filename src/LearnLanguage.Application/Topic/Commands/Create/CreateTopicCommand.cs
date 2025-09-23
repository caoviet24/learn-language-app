using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Domain.Constants;
using MediatR;

namespace LearnLanguage.Application.Topic.Commands
{
    [Authorize(Role = Roles.Admin)]
    public class CreateTopicCommand : IRequest<ResponseDTO<TopicDto>>
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
    }


    public class TopicDto
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
    }
}