using System.Text.Json;

namespace GameStat.Api.Services;

public sealed class OverfastClient(HttpClient httpClient)
{
    public async Task<OverfastResult> GetPlayerSummaryAsync(
        string playerId,
        CancellationToken cancellationToken)
    {
        try
        {
            using var response = await httpClient.GetAsync(
                $"players/{Uri.EscapeDataString(playerId)}/stats/summary",
                cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                return new OverfastResult(
                    false,
                    (int)response.StatusCode,
                    default,
                    "Could not find stats for that player.");
            }

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

            return new OverfastResult(true, 200, document.RootElement.Clone(), "");
        }
        catch (TaskCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            return new OverfastResult(false, 504, default, "The OverFast request timed out.");
        }
        catch (HttpRequestException)
        {
            return new OverfastResult(false, 502, default, "Unable to reach the OverFast API.");
        }
    }
}

public sealed record OverfastResult(
    bool IsSuccess,
    int StatusCode,
    JsonElement Data,
    string ErrorMessage);
