using LearnLanguage.Application;
using LearnLanguage.Infrastructure;
using System;

using Microsoft.OpenApi.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using LearnLanguage.Application.Auth.Commands.Register;
using LearnLanguage.Application.Auth.Commands.Login;
using LearnLanguage.API.Infrastructure;
using LearnLanguage.API;
using LearnLanguage.API.Middlewares;
using MassTransit;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);


builder.Services.AddApi(builder.Configuration);

var MyAllowSpecificOrigins = "MyPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();

    });
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5140); 
});



var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.UseCors(MyAllowSpecificOrigins);

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapEndpoints();

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi(); // Serve OpenAPI/Swagger documents
    app.UseSwagger(); // Serve OpenAPI/Swagger documents
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LearnLanguage API v1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at the root
    });
}


app.Run();
