using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Topic.Commands;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Topic.Queries.GetAll
{
    public class GetAllTopicsQueryHandler(
        IReadDbContext readDbContext,
        IMapper mapper
    ) : IRequestHandler<GetAllTopicsQuery, ResponseDTO<List<TopicDto>>>
    {
        public async Task<ResponseDTO<List<TopicDto>>> Handle(GetAllTopicsQuery request, CancellationToken cancellationToken)
        {
            var topics = await readDbContext.Topics.ToListAsync(cancellationToken);
            var dtos = topics.Select(topic => mapper.Map<TopicDto>(topic)).ToList();

            return new ResponseDTO<List<TopicDto>>
            {
                success = true,
                message = "Fetched all topics.",
                data = dtos
            };
        }
    }
}