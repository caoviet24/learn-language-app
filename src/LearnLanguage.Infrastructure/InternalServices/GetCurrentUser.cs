using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LearnLanguage.Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;

namespace LearnLanguage.Infrastructure.InternalServices
{
    public class GetCurrentUser(IHttpContextAccessor httpContext) : IUser
    {
        public string getCurrentUser()
        {
            return httpContext.HttpContext?.User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        }
    }
}