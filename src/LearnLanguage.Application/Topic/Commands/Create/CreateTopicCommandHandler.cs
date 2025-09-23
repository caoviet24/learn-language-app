using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace LearnLanguage.Application.Topic.Commands
{
    public class CreateTopicCommandHandler(
        IWriteDbContext writeDbContext,
        IReadDbContext readDbContext,
        IMapper mapper
    ) : IRequestHandler<CreateTopicCommand, ResponseDTO<TopicDto>>
    {
        public async Task<ResponseDTO<TopicDto>> Handle(CreateTopicCommand request, System.Threading.CancellationToken cancellationToken)
        {
            var existingTopic = await readDbContext.Topics
                .FirstOrDefaultAsync(t => t.name == request.name, cancellationToken);

            var newTopic = mapper.Map<Topics>(request);

            var result = await writeDbContext.Topics.AddAsync(newTopic, cancellationToken);
            await writeDbContext.SaveChangesAsync(cancellationToken);

            await readDbContext.Topics.AddAsync(newTopic, cancellationToken);
            await readDbContext.SaveChangesAsync(cancellationToken);

            return new ResponseDTO<TopicDto>
            {
                success = true,
                message = "Topic created successfully.",
                data = mapper.Map<TopicDto>(result.Entity)
            };



        }
    }
}