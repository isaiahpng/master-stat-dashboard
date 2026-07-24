using System.Text.Json.Serialization;

namespace GameStat.Api.Models;

public sealed class HeroScore
{
    [JsonPropertyName("hero")]
    public string Hero { get; set; } = "";

    [JsonPropertyName("games_played")]
    public double GamesPlayed { get; set; }

    [JsonPropertyName("winrate")]
    public double Winrate { get; set; }

    [JsonPropertyName("kda")]
    public double Kda { get; set; }

    [JsonPropertyName("hero_confidence")]
    public int HeroConfidence { get; set; }

    [JsonPropertyName("hero_pool")]
    public string HeroPool { get; set; } = "";
}

public sealed class RoleScore
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = "";

    [JsonPropertyName("games_played")]
    public double GamesPlayed { get; set; }

    [JsonPropertyName("winrate")]
    public double Winrate { get; set; }

    [JsonPropertyName("kda")]
    public double Kda { get; set; }

    [JsonPropertyName("role_confidence")]
    public int RoleConfidence { get; set; }
}

public sealed class ScoreItem
{
    [JsonPropertyName("key")]
    public string Key { get; set; } = "";

    [JsonPropertyName("label")]
    public string Label { get; set; } = "";

    [JsonPropertyName("score")]
    public int Score { get; set; }
}

public sealed class PerformanceSnapshot
{
    [JsonPropertyName("scores")]
    public List<ScoreItem> Scores { get; set; } = [];

    [JsonPropertyName("strongest_area")]
    public ScoreItem? StrongestArea { get; set; }

    [JsonPropertyName("weakest_area")]
    public ScoreItem? WeakestArea { get; set; }
}

public sealed class HeroConfidenceResult
{
    [JsonPropertyName("top_heroes")]
    public List<HeroScore> TopHeroes { get; set; } = [];
}

public sealed class RoleConfidenceResult
{
    [JsonPropertyName("best_role")]
    public RoleScore? BestRole { get; set; }

    [JsonPropertyName("all_roles")]
    public List<RoleScore> AllRoles { get; set; } = [];
}

public sealed class HeroPoolResult
{
    [JsonPropertyName("counts")]
    public Dictionary<string, int> Counts { get; set; } = [];

    [JsonPropertyName("risk_picks")]
    public List<HeroScore> RiskPicks { get; set; } = [];
}

public sealed class GameStatSummary
{
    [JsonPropertyName("gamestat_score")]
    public int GameStatScore { get; set; }

    [JsonPropertyName("pressure_rating")]
    public int PressureRating { get; set; }

    [JsonPropertyName("pressure_rating_5")]
    public double PressureRatingFive { get; set; }

    [JsonPropertyName("reliability_score")]
    public int ReliabilityScore { get; set; }

    [JsonPropertyName("reliability_label")]
    public string ReliabilityLabel { get; set; } = "";

    [JsonPropertyName("performance_snapshot")]
    public PerformanceSnapshot PerformanceSnapshot { get; set; } = new();

    [JsonPropertyName("hero_confidence")]
    public HeroConfidenceResult HeroConfidence { get; set; } = new();

    [JsonPropertyName("flex_rating")]
    public int FlexRating { get; set; }

    [JsonPropertyName("flex_label")]
    public string FlexLabel { get; set; } = "";

    [JsonPropertyName("role_confidence")]
    public RoleConfidenceResult RoleConfidence { get; set; } = new();

    [JsonPropertyName("hero_pool")]
    public HeroPoolResult HeroPool { get; set; } = new();

    [JsonPropertyName("ai_review")]
    public string AiReview { get; set; } = "";
}
