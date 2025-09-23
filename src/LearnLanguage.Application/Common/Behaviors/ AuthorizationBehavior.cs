using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Sercurity;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace LearnLanguage.Application.Common.Behaviors
{
    public class AuthorizationBehavior<TRequest, TResponse>(IHttpContextAccessor httpContextAccessor) : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull
    {

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var authorizeAttribute = typeof(TRequest).GetCustomAttributes(typeof(AuthorizeAttribute), true).FirstOrDefault();
            if (authorizeAttribute != null)
            {
                var user = httpContextAccessor.HttpContext?.User;
                if (user == null || user.Identity == null || !user.Identity.IsAuthenticated)
                    throw new UnauthorizedAccessException("Not authorized");
            }

            return await next();
        }
    }
}