using System;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Topic.Commands;
using MediatR;
using System.Collections.Generic;
using LearnLanguage.Application.Common.Sercurity;

namespace LearnLanguage.Application.Topic.Queries.GetAll
{
    [Authorize]
    public class GetAllTopicsQuery : IRequest<ResponseDTO<List<TopicDto>>>
    {
    }
}