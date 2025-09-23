using LearnLanguage.API.Infrastructure;
using LearnLanguage.Application.Auth.Commands.Login;
using LearnLanguage.Application.Auth.Commands.Register;
using LearnLanguage.Application.Auth.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LearnLanguage.API.Endpoints;

public class AuthEndpoints : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetMyInfoAsync, "me")
            .MapPost(RegisterAsync, "register")
            .MapPost(LoginAsync, "login");

    }

    private async Task<IResult> RegisterAsync(ISender sender, [FromBody] RegisterCommand request)
    {
        var response = await sender.Send(request);
        return Results.Ok(response);
    }

    private async Task<IResult> LoginAsync(ISender sender, [FromBody] LoginCommand request)
    {
        var response = await sender.Send(request);
        return Results.Ok(response);
    }

    private async Task<IResult> GetMyInfoAsync(ISender sender)
    {
        var response = await sender.Send(new GetMyInfoQuery());
        return Results.Ok(response);
    }


}

