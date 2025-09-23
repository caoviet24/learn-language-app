using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Topic.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Topic.Queries.GetById
{
    public class GetTopicByIdQueryHandler(
        IReadDbContext readDbContext,
        IMapper mapper
    ) : IRequestHandler<GetTopicByIdQuery, ResponseDTO<TopicDto>>
    {
        public async Task<ResponseDTO<TopicDto>> Handle(GetTopicByIdQuery request, CancellationToken cancellationToken)
        {
            var topic = await readDbContext.Topics.FirstOrDefaultAsync(t => t.Id == request.Id, cancellationToken);
            if (topic == null)
            {
                return new ResponseDTO<TopicDto>
                {
                    success = false,
                    message = "Topic not found.",
                    data = null
                };
            }

            return new ResponseDTO<TopicDto>
            {
                success = true,
                message = "Fetched topic.",
                data = mapper.Map<TopicDto>(topic)
            };
        }
    }
}