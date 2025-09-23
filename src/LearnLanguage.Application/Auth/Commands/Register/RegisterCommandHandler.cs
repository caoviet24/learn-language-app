using AutoMapper;
using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Application.Events;
using LearnLanguage.Domain.Constants;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LearnLanguage.Application.Auth.Commands.Register;

public class RegisterCommandHandler(
    IReadDbContext readDbContext,
    IWriteDbContext writeDbContext,
    IPasswordHasher passwordHasher,
    IEventPublisher eventPublisher,
    ICacheService cacheService,
    IMapper mapper,
    ILogger<RegisterCommandHandler> logger
) : IRequestHandler<RegisterCommand, ResponseDTO<RegisterResponse>>
{
    public async Task<ResponseDTO<RegisterResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Handling RegisterCommand for email: {Email}", request.email);
        var email = new Email(request.email);

        var checkCachedUser = await cacheService.GetAsync<User>(email.Value);
        if (checkCachedUser != null)
        {

            logger.LogWarning("User already exists in cache for email: {Email}", email.Value);
            return new ResponseDTO<RegisterResponse>
            {
                success = false,
                message = "User already exists.",
            };
        }

        var checkEmailExistsInDb = await readDbContext.Users.AnyAsync(u => u.email == email.Value, cancellationToken);
        if (checkEmailExistsInDb)
        {
            logger.LogWarning("User already exists in database for email: {Email}", email.Value);
            return new ResponseDTO<RegisterResponse>
            {
                success = false,
                message = "Email already exists.",
            };
        }



        var newUser = mapper.Map<User>(request);
        newUser.password = passwordHasher.Hash(request.password);

        newUser.role = Roles.User;

        var newUserRecord = await writeDbContext.Users.AddAsync(newUser, cancellationToken);
        await writeDbContext.SaveChangesAsync(cancellationToken);

        await cacheService.SetAsync(email.Value, newUser, TimeSpan.FromSeconds(10), cancellationToken);


        // var userRegisteredEvent = new UserRegisteredEvent(
        //     newUserRecord.Entity.Id,
        //     newUserRecord.Entity.email,
        //     newUserRecord.Entity.password,
        //     newUserRecord.Entity.firstName,
        //     newUserRecord.Entity.lastName,
        //     newUserRecord.Entity.role
        // );

        // await eventPublisher.PublishAsync(userRegisteredEvent, cancellationToken);


        return new ResponseDTO<RegisterResponse>
        {
            success = true,
            message = "User registered successfully.",
            data = mapper.Map<RegisterResponse>(newUserRecord.Entity)
        };

    }
}