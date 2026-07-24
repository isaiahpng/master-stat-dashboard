using System.Globalization;
using System.Text.Json;
using GameStat.Api.Models;

namespace GameStat.Api.Services;

public sealed class GameStatCalculator
{
    public GameStatSummary BuildSummary(JsonElement statsData)
    {
        var general = GetObject(statsData, "general");
        var heroes = GetObject(statsData, "heroes");
        var roles = GetObject(statsData, "roles");

        var scoredHeroes = heroes.ValueKind == JsonValueKind.Object
            ? heroes.EnumerateObject().Select(property => BuildHero(property.Name, property.Value)).ToList()
            : [];

        var scoredRoles = roles.ValueKind == JsonValueKind.Object
            ? roles.EnumerateObject().Select(property => BuildRole(property.Name, property.Value)).ToList()
            : [];

        var flexRating = CalculateFlexRating(scoredHeroes);
        var pressureRating = CalculatePressureRating(general);
        var reliabilityScore = CalculateReliabilityScore(general);

        var sortedRoles = scoredRoles
            .OrderByDescending(role => role.RoleConfidence)
            .ToList();

        var topHeroes = scoredHeroes
            .Where(hero => hero.GamesPlayed >= 10)
            .OrderByDescending(hero => hero.HeroConfidence)
            .Take(5)
            .ToList();

        var counts = scoredHeroes
            .GroupBy(hero => hero.HeroPool)
            .ToDictionary(group => group.Key, group => group.Count());

        var riskPicks = scoredHeroes
            .Where(hero => hero.GamesPlayed >= 25 && hero.HeroConfidence < 55)
            .OrderByDescending(hero => hero.GamesPlayed)
            .Take(5)
            .ToList();

        return new GameStatSummary
        {
            GameStatScore = CalculateGameStatScore(
                general,
                scoredHeroes,
                scoredRoles,
                pressureRating,
                flexRating),
            PressureRating = pressureRating,
            PressureRatingFive = Math.Round(pressureRating / 100d * 5d, 1),
            ReliabilityScore = reliabilityScore,
            ReliabilityLabel = AssignReliabilityLabel(reliabilityScore),
            PerformanceSnapshot = CreatePerformanceSnapshot(
                general,
                scoredHeroes,
                scoredRoles,
                pressureRating,
                flexRating),
            HeroConfidence = new HeroConfidenceResult { TopHeroes = topHeroes },
            FlexRating = flexRating,
            FlexLabel = AssignFlexLabel(flexRating),
            RoleConfidence = new RoleConfidenceResult
            {
                BestRole = sortedRoles.FirstOrDefault(),
                AllRoles = sortedRoles
            },
            HeroPool = new HeroPoolResult
            {
                Counts = counts,
                RiskPicks = riskPicks
            }
        };
    }

    private static HeroScore BuildHero(string name, JsonElement stats)
    {
        var hero = new HeroScore
        {
            Hero = name,
            GamesPlayed = GetNumber(stats, "games_played"),
            Winrate = GetNumber(stats, "winrate"),
            Kda = GetNumber(stats, "kda")
        };

        hero.HeroConfidence = CalculateHeroConfidence(hero);
        hero.HeroPool = AssignHeroPool(hero);
        return hero;
    }

    private static RoleScore BuildRole(string name, JsonElement stats)
    {
        var role = new RoleScore
        {
            Role = name,
            GamesPlayed = GetNumber(stats, "games_played"),
            Winrate = GetNumber(stats, "winrate"),
            Kda = GetNumber(stats, "kda")
        };

        role.RoleConfidence = CalculateRoleConfidence(role);
        return role;
    }

    private static int CalculateHeroConfidence(HeroScore hero)
    {
        var adjustedWinrate = AdjustedWinrate(hero.Winrate, hero.GamesPlayed, 50, 50);
        var score = Clamp((adjustedWinrate - 40) / 30) * .45
            + Clamp(hero.Kda / 6) * .35
            + Clamp(hero.GamesPlayed / 150) * .20;

        return RoundScore(score);
    }

    private static string AssignHeroPool(HeroScore hero)
    {
        if (hero.GamesPlayed < 10) return "Unproven";
        if (hero.HeroConfidence >= 75) return "Proven Pick";
        if (hero.HeroConfidence >= 55) return "Comfort Pick";
        return "Risk Pick";
    }

    private static int CalculateFlexRating(IEnumerable<HeroScore> heroes)
    {
        var viableHeroes = heroes.Count(hero =>
            hero.GamesPlayed >= 10 && hero.HeroConfidence >= 55);

        return RoundScore(Clamp(viableHeroes / 8d));
    }

    private static string AssignFlexLabel(int score) => score switch
    {
        >= 80 => "Highly Flexible",
        >= 55 => "Flexible",
        >= 30 => "Specialist",
        _ => "One-Trick Leaning"
    };

    private static int CalculateRoleConfidence(RoleScore role)
    {
        var adjustedWinrate = AdjustedWinrate(role.Winrate, role.GamesPlayed, 50, 100);
        var score = Clamp((adjustedWinrate - 40) / 25) * .50
            + Clamp(role.Kda / 5) * .30
            + Clamp(role.GamesPlayed / 300) * .20;

        return RoundScore(score);
    }

    private static int CalculatePressureRating(JsonElement general)
    {
        var winrate = GetNumber(general, "winrate");
        var kda = GetNumber(general, "kda");
        var deathsPerGame = GetAverageStat(general, "deaths", kda);

        var score = Clamp((winrate - 45) / 20) * .40
            + Clamp(kda / 5) * .35
            + Clamp((10 - deathsPerGame) / 10) * .25;

        return RoundScore(score);
    }

    private static int CalculateReliabilityScore(JsonElement general)
    {
        var gamesPlayed = GetNumber(general, "games_played");
        var winrate = GetNumber(general, "winrate");
        var kda = GetNumber(general, "kda");
        var adjustedWinrate = AdjustedWinrate(winrate, gamesPlayed, 50, 500);

        var score = Clamp((adjustedWinrate - 40) / 25) * .45
            + Clamp(kda / 5) * .35
            + Clamp(gamesPlayed / 1000) * .20;

        return RoundScore(score);
    }

    private static string AssignReliabilityLabel(int score) => score switch
    {
        >= 75 => "Highly Reliable",
        >= 55 => "Reliable",
        >= 35 => "Developing",
        _ => "Unstable"
    };

    private static int CalculateGameStatScore(
        JsonElement general,
        List<HeroScore> heroes,
        List<RoleScore> roles,
        int pressureRating,
        int flexRating)
    {
        var winrate = GetNumber(general, "winrate");
        var kda = GetNumber(general, "kda");

        var trustedHeroes = heroes.Where(hero => hero.GamesPlayed >= 10).ToList();
        var heroSource = trustedHeroes.Count > 0 ? trustedHeroes : heroes;

        var topHeroScore = heroSource.Count > 0
            ? heroSource.Max(hero => hero.HeroConfidence) / 100d
            : 0;

        var bestRoleScore = roles.Count > 0
            ? roles.Max(role => role.RoleConfidence) / 100d
            : 0;

        var score = Clamp((winrate - 40) / 25) * .25
            + Clamp(kda / 5) * .20
            + topHeroScore * .20
            + bestRoleScore * .15
            + flexRating / 100d * .10
            + pressureRating / 100d * .10;

        return RoundScore(score);
    }

    private static PerformanceSnapshot CreatePerformanceSnapshot(
        JsonElement general,
        List<HeroScore> heroes,
        List<RoleScore> roles,
        int pressureRating,
        int flexRating)
    {
        var trustedHeroes = heroes.Where(hero => hero.GamesPlayed >= 10).ToList();
        var heroSource = trustedHeroes.Count > 0 ? trustedHeroes : heroes;

        var scores = new List<ScoreItem>
        {
            new() { Key = "winrate_score", Label = "Win Rate", Score = RoundScore(Clamp((GetNumber(general, "winrate") - 40) / 25)) },
            new() { Key = "kda_score", Label = "KDA", Score = RoundScore(Clamp(GetNumber(general, "kda") / 5)) },
            new() { Key = "pressure_rating", Label = "Pressure", Score = pressureRating },
            new() { Key = "flex_rating", Label = "Flex", Score = flexRating },
            new() { Key = "best_role_score", Label = "Best Role", Score = roles.Count > 0 ? roles.Max(role => role.RoleConfidence) : 0 },
            new() { Key = "top_hero_score", Label = "Top Hero", Score = heroSource.Count > 0 ? heroSource.Max(hero => hero.HeroConfidence) : 0 }
        };

        return new PerformanceSnapshot
        {
            Scores = scores,
            StrongestArea = scores.MaxBy(item => item.Score),
            WeakestArea = scores.MinBy(item => item.Score)
        };
    }

    private static JsonElement GetObject(JsonElement parent, string propertyName)
    {
        return parent.ValueKind == JsonValueKind.Object
            && parent.TryGetProperty(propertyName, out var value)
            && value.ValueKind == JsonValueKind.Object
                ? value
                : default;
    }

    private static double GetAverageStat(
        JsonElement data,
        string statName,
        double fallback)
    {
        var average = GetObject(data, "average");
        var nestedValue = GetNumber(average, statName, double.NaN);
        if (!double.IsNaN(nestedValue)) return nestedValue;

        var flatValue = GetNumber(data, $"average_{statName}", double.NaN);
        return double.IsNaN(flatValue) ? fallback : flatValue;
    }

    private static double GetNumber(
        JsonElement data,
        string propertyName,
        double fallback = 0)
    {
        if (data.ValueKind != JsonValueKind.Object
            || !data.TryGetProperty(propertyName, out var value))
        {
            return fallback;
        }

        if (value.ValueKind == JsonValueKind.Number && value.TryGetDouble(out var number))
        {
            return number;
        }

        if (value.ValueKind == JsonValueKind.String
            && double.TryParse(
                value.GetString(),
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out number))
        {
            return number;
        }

        return fallback;
    }

    private static double AdjustedWinrate(
        double winrate,
        double gamesPlayed,
        double baseline,
        double reliableSample)
    {
        var sampleWeight = Clamp(gamesPlayed / reliableSample);
        return baseline + (winrate - baseline) * sampleWeight;
    }

    private static double Clamp(double value, double minimum = 0, double maximum = 1)
        => Math.Max(minimum, Math.Min(value, maximum));

    private static int RoundScore(double normalizedScore)
        => (int)Math.Round(Clamp(normalizedScore) * 100, MidpointRounding.AwayFromZero);
}
