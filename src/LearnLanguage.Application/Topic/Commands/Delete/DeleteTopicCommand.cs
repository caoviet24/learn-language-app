using System;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Sercurity;
using LearnLanguage.Domain.Constants;
using MediatR;

namespace LearnLanguage.Application.Topic.Commands.Delete
{
    [Authorize(Role = Roles.Admin)]
    public class DeleteTopicCommand : IRequest<ResponseDTO<bool>>
    {
        public string Id { get; set; } = null!;
    }
}