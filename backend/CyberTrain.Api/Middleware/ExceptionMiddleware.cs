using System.Net;
using System.Text.Json;
using CyberTrain.Domain.Models.Responces;

namespace CyberTrain.Api.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _log;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> log)
        {
            _next = next;
            _log = log;
        }

        public async Task Invoke(HttpContext ctx)
        {
            try { await _next(ctx); }
            catch (Exception ex)
            {
                _log.LogError(ex, "Eroare neașteptată în pipeline");
                await Write(ctx, HttpStatusCode.InternalServerError, "A apărut o eroare pe server.");
            }
        }

        private static Task Write(HttpContext ctx, HttpStatusCode code, string message)
        {
            ctx.Response.ContentType = "application/json";
            ctx.Response.StatusCode = (int)code;
            var payload = new ActionResponce { IsSuccess = false, Message = message };
            return ctx.Response.WriteAsync(JsonSerializer.Serialize(payload,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
        }
    }
}
