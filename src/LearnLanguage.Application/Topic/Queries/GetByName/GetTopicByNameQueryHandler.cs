using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Topic.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Topic.Queries.GetByName
{
    public class GetTopicByNameQueryHandler(
        IReadDbContext readDbContext,
        IMapper mapper
    ) : IRequestHandler<GetTopicByNameQuery, ResponseDTO<TopicDto>>
    {
        public async Task<ResponseDTO<TopicDto>> Handle(GetTopicByNameQuery request, CancellationToken cancellationToken)
        {
            var topic = await readDbContext.Topics.FirstOrDefaultAsync(t => t.name == request.name, cancellationToken);
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