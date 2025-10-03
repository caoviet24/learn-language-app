using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.API.Infrastructure;
using LearnLanguage.Application.UserActivities.Commands.Create;
using LearnLanguage.Application.UserActivities.Queries.GetByUserId;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LearnLanguage.API.Endpoints
{
    public class UserActivityEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .MapGet(getByUserIdAsync, "get-by-user")
                .MapPost(createActivityAsync, "create");
        }

        private async Task<IResult> getByUserIdAsync(ISender sender, [AsParameters] GetUserActivityQuery request)
        {
            return Results.Ok(await sender.Send(request));
        }

        private async Task<IResult> createActivityAsync(ISender sender, [FromBody] CreateUserActivityCommand request)
        {
            return Results.Ok(await sender.Send(request));
        }
    }
}