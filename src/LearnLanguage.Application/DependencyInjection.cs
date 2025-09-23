using System.Reflection;
using FluentValidation;
using LearnLanguage.Application.Common.Behaviors;
using LearnLanguage.Application.Common.Mapping;
using MediatR;
using Microsoft.Extensions.DependencyInjection;


namespace LearnLanguage.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
        });

        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(CachingBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

       services.AddAutoMapper(typeof(MapperProfile).Assembly);


        return services;
    }
}