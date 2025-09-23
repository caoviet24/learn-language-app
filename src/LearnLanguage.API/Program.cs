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

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Override HuggingFace API key from environment variable if available
var huggingFaceApiKey = Environment.GetEnvironmentVariable("HUGGINGFACE_API_KEY");
if (!string.IsNullOrEmpty(huggingFaceApiKey))
{
    builder.Configuration["HuggingFace:ApiKey"] = huggingFaceApiKey;
}

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
