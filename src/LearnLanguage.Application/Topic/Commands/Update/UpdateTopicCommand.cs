using System;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Domain.Constants;
using MediatR;

namespace LearnLanguage.Application.Topic.Commands.Update
{
    [Authorize(Role = Roles.Admin)]
    public class UpdateTopicCommand : IRequest<ResponseDTO<TopicDto>>
    {
        public string Id { get; set; } = null!;
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
    }
}