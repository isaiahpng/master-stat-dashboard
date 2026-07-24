using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using GameStat.Api.Models;

namespace GameStat.Api.Services;

public sealed class AiReviewService(HttpClient httpClient, IConfiguration configuration)
{
    public async Task<string> CreateReviewAsync(
        GameStatSummary summary,
        CancellationToken cancellationToken)
    {
        var apiKey = configuration["OPENAI_API_KEY"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return CreateFallbackReview(summary);
        }

        var requestBody = new
        {
            model = configuration["OPENAI_MODEL"] ?? "gpt-4.1-mini",
            max_output_tokens = 120,
            input = new object[]
            {
                new
                {
                    role = "system",
                    content = "You write short esports performance summaries for GameStat. Be direct, useful, and do not overhype. Use only the provided metrics."
                },
                new
                {
                    role = "user",
                    content = JsonSerializer.Serialize(new
                    {
                        gamestat_score = summary.GameStatScore,
                        pressure_rating = summary.PressureRating,
                        reliability_score = summary.ReliabilityScore,
                        flex_rating = summary.FlexRating,
                        flex_label = summary.FlexLabel,
                        best_role = summary.RoleConfidence.BestRole,
                        top_heroes = summary.HeroConfidence.TopHeroes,
                        hero_pool = summary.HeroPool.Counts,
                        strongest_area = summary.PerformanceSnapshot.StrongestArea,
                        weakest_area = summary.PerformanceSnapshot.WeakestArea
                    })
                }
            }
        };

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.openai.com/v1/responses");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json");

        try
        {
            using var response = await httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode) return CreateFallbackReview(summary);

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
            var root = document.RootElement;

            if (root.TryGetProperty("output_text", out var outputText)
                && outputText.ValueKind == JsonValueKind.String)
            {
                return outputText.GetString()?.Trim() ?? CreateFallbackReview(summary);
            }

            if (root.TryGetProperty("output", out var output)
                && output.ValueKind == JsonValueKind.Array
                && output.GetArrayLength() > 0)
            {
                var first = output[0];
                if (first.TryGetProperty("content", out var content)
                    && content.ValueKind == JsonValueKind.Array
                    && content.GetArrayLength() > 0
                    && content[0].TryGetProperty("text", out var text)
                    && text.ValueKind == JsonValueKind.String)
                {
                    return text.GetString()?.Trim() ?? CreateFallbackReview(summary);
                }
            }
        }
        catch (HttpRequestException)
        {
            // A deterministic review keeps the endpoint usable when the AI service is unavailable.
        }

        return CreateFallbackReview(summary);
    }

    private static string CreateFallbackReview(GameStatSummary summary)
    {
        var bestRole = summary.RoleConfidence.BestRole;
        var topHero = summary.HeroConfidence.TopHeroes.FirstOrDefault();
        var weakestArea = summary.PerformanceSnapshot.WeakestArea;

        if (bestRole is null || topHero is null || weakestArea is null)
        {
            return "GameStat found player data, but there was not enough public hero or role data to generate a full review.";
        }

        return $"You profile as a {summary.FlexLabel.ToLowerInvariant()} player with {bestRole.Role} as your strongest role. Your strongest hero is {FormatHeroName(topHero.Hero)}, and your biggest improvement area is {weakestArea.Label.ToLowerInvariant()}.";
    }

    private static string FormatHeroName(string hero)
        => string.Join(" ", hero
            .Split('-', StringSplitOptions.RemoveEmptyEntries)
            .Select(word => char.ToUpperInvariant(word[0]) + word[1..]));
}
