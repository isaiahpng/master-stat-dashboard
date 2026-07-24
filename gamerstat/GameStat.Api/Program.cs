using GameStat.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<OverfastClient>(client =>
{
    client.BaseAddress = new Uri("https://overfast-api.tekrop.fr/");
    client.Timeout = TimeSpan.FromSeconds(20);
});

builder.Services.AddHttpClient<AiReviewService>();
builder.Services.AddSingleton<GameStatCalculator>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("GameStatFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://gamerstat.netlify.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("GameStatFrontend");

app.MapGet("/", () => Results.Ok(new
{
    service = "GameStat ASP.NET Core API",
    status = "running"
}));

app.MapGet("/api/gamestat/{playerId}", async (
    string playerId,
    OverfastClient overfastClient,
    GameStatCalculator calculator,
    AiReviewService aiReviewService,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(playerId))
    {
        return Results.BadRequest(new { message = "Missing playerId route parameter." });
    }

    var result = await overfastClient.GetPlayerSummaryAsync(playerId, cancellationToken);

    if (!result.IsSuccess)
    {
        return Results.Json(
            new { message = result.ErrorMessage },
            statusCode: result.StatusCode);
    }

    var summary = calculator.BuildSummary(result.Data);
    summary.AiReview = await aiReviewService.CreateReviewAsync(summary, cancellationToken);

    return Results.Ok(summary);
});

app.Run();
