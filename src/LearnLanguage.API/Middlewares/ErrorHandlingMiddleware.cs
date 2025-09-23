using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace LearnLanguage.API.Middlewares
{
   public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);

                if (context.Response.StatusCode >= 400 && !context.Response.HasStarted)
                {
                    await WriteErrorResponseAsync(context, context.Response.StatusCode, "Request error");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var statusCode = HttpStatusCode.InternalServerError; 

            if (exception is UnauthorizedAccessException)
                statusCode = HttpStatusCode.Unauthorized;
            else if (exception is ArgumentException)
                statusCode = HttpStatusCode.BadRequest;
            else if (exception is KeyNotFoundException)
                statusCode = HttpStatusCode.NotFound;

            return WriteErrorResponseAsync(context, (int)statusCode, exception.Message);
        }

        private static Task WriteErrorResponseAsync(HttpContext context, int statusCode, string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var result = JsonSerializer.Serialize(new
            {
                status = statusCode,
                error = message
            });

            return context.Response.WriteAsync(result);
        }
    }
}