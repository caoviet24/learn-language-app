using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.API.Infrastructure;
using LearnLanguage.Application.Users.Commands.Delete;
using LearnLanguage.Application.Users.Commands.Update;
using LearnLanguage.Application.Users.Queries.GetAll;
using LearnLanguage.Application.Users.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;


namespace LearnLanguage.API.Endpoints
{
    public class UserEndpoint : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .MapGet(getAllUser, "get-all")
                .MapGet(getUserByIdAsync, "get-by-id/{id}")
                .MapPut(UpdateUserAsync, "update")
                .MapDelete(deleteUserAsync, "delete/{id}");
        }

        private async Task<IResult> getAllUser(ISender sender, [AsParameters] GetAllUserQuery request)
        {
            return Results.Ok(await sender.Send(request));
        }

        private async Task<IResult> getUserByIdAsync(ISender sender, [FromRoute] string id)
        {
            return Results.Ok(await sender.Send(new GetUserByIdQuery { Id = id }));
        }

        private async Task<IResult> UpdateUserAsync(ISender sender, [FromBody] UpdateUserCommand command)
        {
            return Results.Ok(await sender.Send(command));
        }

        private async Task<IResult> deleteUserAsync(ISender sender, [FromRoute] string id)
        {
            return Results.Ok(await sender.Send(new DeleteUserCommand { Id = id }));
        }
    }
}