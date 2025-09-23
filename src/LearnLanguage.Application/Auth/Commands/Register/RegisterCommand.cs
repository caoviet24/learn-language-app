using LearnLanguage.Application.Common.DTOs;
using MediatR;

namespace LearnLanguage.Application.Auth.Commands.Register;

public record RegisterCommand : IRequest<ResponseDTO<RegisterResponse>>
{
    public string email { get; init; } = null!;
    public string password { get; init; } = null!;
    public string firstName { get; init; } = null!;
    public string lastName { get; init; } = null!;
}

public record RegisterResponse
{
    public string Id { get; init; } = null!;
    public string email { get; init; } = null!;
    public string firstName { get; init; } = null!;
    public string lastName { get; init; } = null!;
    public string nickName { get; init; } = null!;
    public string role { get; init; } = null!;
};