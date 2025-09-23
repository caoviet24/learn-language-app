using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Application.Topic.Commands;
using MediatR;

namespace LearnLanguage.Application.Topic.Queries.GetById
{
    [Authorize]
    public class GetTopicByIdQuery : IRequest<ResponseDTO<TopicDto>>
    {
        public string Id { get; set; } = null!;
    }
}