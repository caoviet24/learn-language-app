using System;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Application.Topic.Commands;
using MediatR;

namespace LearnLanguage.Application.Topic.Queries.GetByName
{
    [Authorize]
    public class GetTopicByNameQuery : IRequest<ResponseDTO<TopicDto>>
    {
        public string name { get; set; } = null!;
    }
}