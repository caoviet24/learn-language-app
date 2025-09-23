using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.API.Infrastructure;
using LearnLanguage.Application.Topic.Commands;
using LearnLanguage.Application.Topic.Commands.Delete;
using LearnLanguage.Application.Topic.Commands.Update;
using LearnLanguage.Application.Topic.Queries.GetAll;
using LearnLanguage.Application.Topic.Queries.GetById;
using LearnLanguage.Application.Topic.Queries.GetByName;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LearnLanguage.API.Endpoints
{
    public class TopicEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .MapGet(getAllTopicsAsync, "get-all")
                .MapGet(getTopicByIdAsync, "get-by-id/{id}")
                .MapGet(getTopicByNameAsync, "get-by-name/{name}")
                .MapPost(createTopicAsync, "create")
                .MapPut(updateTopicAsync, "update")
                .MapDelete(deleteTopicAsync, "delete/{id}");
        }

        private async Task<IResult> getAllTopicsAsync(ISender sender)
        {
            return Results.Ok(await sender.Send(new GetAllTopicsQuery()));
        }

        private async Task<IResult> getTopicByIdAsync(ISender sender, [FromRoute] string id)
        {
            return Results.Ok(await sender.Send(new GetTopicByIdQuery { Id = id }));
        }
        private async Task<IResult> getTopicByNameAsync(ISender sender, [FromRoute] string name)
        {
            return Results.Ok(await sender.Send(new GetTopicByNameQuery { name = name }));
        }

        public async Task<IResult> createTopicAsync(ISender sender, [FromBody] CreateTopicCommand command)
        {
            return Results.Ok(await sender.Send(command));
        }

        public async Task<IResult> updateTopicAsync(ISender sender, [FromBody] UpdateTopicCommand command)
        {
            return Results.Ok(await sender.Send(command));
        }

        public async Task<IResult> deleteTopicAsync(ISender sender, [FromRoute] string id)
        {
            return Results.Ok(await sender.Send(new DeleteTopicCommand { Id = id }));
        }
    }
}