using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LearnLanguage.API.Infrastructure
{
    public abstract class EndpointGroupBase
    {
        public abstract void Map(WebApplication app);
    }
}