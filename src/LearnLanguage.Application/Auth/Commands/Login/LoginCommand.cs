using LearnLanguage.Application.Common.DTOs;
using MediatR;

namespace LearnLanguage.Application.Auth.Commands.Login;

public record LoginCommand(
    string email,
    string nickName,
    string password
) : IRequest<ResponseDTO<LoginResponse>>;

public record LoginResponse
{
    public string access_token { get; init; } = null!;
    public string refresh_token { get; init; } = null!;
}