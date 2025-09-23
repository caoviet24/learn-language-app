using LearnLanguage.Application.Common.DTOs;
using LearnLanguage.Application.Common.Interfaces;
using LearnLanguage.Domain.Entities;
using LearnLanguage.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LearnLanguage.Application.Auth.Commands.Login
{
    public class LoginCommandHandler(
        IPasswordHasher passwordHasher,
        IJwtService jwtService,
        ICacheService cacheService,
        IReadDbContext readDbContext,
        ILogger<LoginCommandHandler> logger
    ) : IRequestHandler<LoginCommand, ResponseDTO<LoginResponse>>
    {
        public async Task<ResponseDTO<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {

            var email = new Email(request.email);

            var findValue = email.Value ?? request.nickName;


            var cachedUser = await cacheService.GetAsync<User>(findValue, cancellationToken);

            var user = cachedUser;

            if (user == null)
            {
                logger.LogInformation("User not found in cache, querying database for {FindValue}", findValue);
                user = await readDbContext.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.email == findValue || u.nickName == findValue, cancellationToken);

                if (user != null)
                {
                    await cacheService.SetAsync(findValue, user, TimeSpan.FromMinutes(30), cancellationToken);
                }
            }
            else
            {
                logger.LogInformation("User found in cache for {FindValue}", findValue);
                logger.LogInformation("User found in cache: {UserId}", user.Id);
            }


            if (user == null)
            {
                return new ResponseDTO<LoginResponse>
                {
                    success = false,
                    message = "Thông tin đăng nhập không chính xác.",
                };
            }

            if (!passwordHasher.Verify(request.password, user.password))
            {
                return new ResponseDTO<LoginResponse>
                {
                    success = false,
                    message = "Mật khẩu không chính xác.",
                };
            }

            // Generate tokens
            var accessToken = await jwtService.generateAccessTokenAsync(user);
            var refreshToken = await jwtService.generateRefreshTokenAsync(user);

            return new ResponseDTO<LoginResponse>
            {
                success = true,
                message = "Đăng nhập thành công.",
                data = new LoginResponse
                {
                    access_token = accessToken,
                    refresh_token = refreshToken
                }
            };
        }
    }
}