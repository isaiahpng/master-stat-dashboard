import math


def safe_number(value, default=0):
    """
    Converts a value into a regular number.

    API data and Pandas values can sometimes be missing, weird, or NaN.
    This keeps the metric formulas from crashing.
    """
    if value is None:
        return default

    try:
        number = float(value)
    except (TypeError, ValueError):
        return default

    if math.isnan(number):
        return default

    return number


def clamp(value, min_value=0, max_value=1):
    """
    Keeps a number between a minimum and maximum value.
    """
    value = safe_number(value)

    return max(min_value, min(value, max_value))


def adjusted_winrate(winrate, games_played, baseline=50, reliable_sample=50):
    """
    Adjusts win rate based on sample size.

    Example:
    A hero with 2 games and 100% win rate should not be treated
    as more reliable than a hero with 400 games and 54% win rate.

    This pulls low-sample win rates closer to 50%.
    """
    winrate = safe_number(winrate)
    games_played = safe_number(games_played)

    sample_weight = clamp(games_played / reliable_sample)

    return baseline + ((winrate - baseline) * sample_weight)


def calculate_hero_confidence(row):
    """
    Hero Confidence measures how trustworthy a hero is for this player.

    It combines:
    - adjusted win rate
    - KDA
    - games played

    The score returns a number from 0 to 100.
    """

    games_played = safe_number(row.get("games_played", 0))
    winrate = safe_number(row.get("winrate", 0))
    kda = safe_number(row.get("kda", 0))

    adjusted_wr = adjusted_winrate(
        winrate=winrate,
        games_played=games_played,
        reliable_sample=50
    )

    winrate_score = clamp((adjusted_wr - 40) / 30)
    kda_score = clamp(kda / 6)
    sample_score = clamp(games_played / 150)

    confidence = (
        winrate_score * 0.45 +
        kda_score * 0.35 +
        sample_score * 0.20
    )

    return round(clamp(confidence) * 100)


def assign_hero_pool(row):
    """
    Places each hero into a useful player-facing group.
    """
    games_played = safe_number(row.get("games_played", 0))
    hero_confidence = safe_number(row.get("hero_confidence", 0))

    if games_played < 10:
        return "Unproven"

    if hero_confidence >= 75:
        return "Proven Pick"

    if hero_confidence >= 55:
        return "Comfort Pick"

    return "Risk Pick"


def add_hero_metrics(heroes_df):
    """
    Adds hero-level GameStat metrics.
    """
    heroes_df = heroes_df.copy()

    heroes_df["adjusted_winrate"] = heroes_df.apply(
        lambda row: adjusted_winrate(
            winrate=row.get("winrate", 0),
            games_played=row.get("games_played", 0),
            reliable_sample=50
        ),
        axis=1
    )

    heroes_df["hero_confidence"] = heroes_df.apply(
        calculate_hero_confidence,
        axis=1
    )

    heroes_df["hero_pool"] = heroes_df.apply(
        assign_hero_pool,
        axis=1
    )

    return heroes_df


def calculate_flex_rating(heroes_df):
    """
    Flex Rating measures how many heroes the player can perform well on.

    A viable hero must have:
    - at least 10 games
    - at least 55 Hero Confidence
    """
    viable_heroes = heroes_df[
        (heroes_df["games_played"] >= 10) &
        (heroes_df["hero_confidence"] >= 55)
    ]

    flex_rating = clamp(len(viable_heroes) / 8)

    return round(flex_rating * 100)


def assign_flex_label(flex_rating):
    """
    Turns Flex Rating into readable language.
    """
    flex_rating = safe_number(flex_rating)

    if flex_rating >= 80:
        return "Highly Flexible"

    if flex_rating >= 55:
        return "Flexible"

    if flex_rating >= 30:
        return "Specialist"

    return "One-Trick Leaning"


def calculate_role_confidence(row):
    """
    Role Confidence compares tank, damage, and support strength.
    """
    games_played = safe_number(row.get("games_played", 0))
    winrate = safe_number(row.get("winrate", 0))
    kda = safe_number(row.get("kda", 0))

    adjusted_wr = adjusted_winrate(
        winrate=winrate,
        games_played=games_played,
        reliable_sample=100
    )

    winrate_score = clamp((adjusted_wr - 40) / 25)
    kda_score = clamp(kda / 5)
    sample_score = clamp(games_played / 300)

    confidence = (
        winrate_score * 0.50 +
        kda_score * 0.30 +
        sample_score * 0.20
    )

    return round(clamp(confidence) * 100)


def add_role_metrics(roles_df):
    """
    Adds role-level GameStat metrics.
    """
    roles_df = roles_df.copy()

    roles_df["adjusted_winrate"] = roles_df.apply(
        lambda row: adjusted_winrate(
            winrate=row.get("winrate", 0),
            games_played=row.get("games_played", 0),
            reliable_sample=100
        ),
        axis=1
    )

    roles_df["role_confidence"] = roles_df.apply(
        calculate_role_confidence,
        axis=1
    )

    return roles_df


def get_best_role(roles_df):
    """
    Returns the player's strongest role.
    """
    sorted_roles = roles_df.sort_values("role_confidence", ascending=False)
    best_role = sorted_roles.iloc[0]

    return {
        "role": best_role["role"],
        "role_confidence": best_role["role_confidence"],
        "winrate": best_role["winrate"],
        "kda": best_role["kda"],
        "games_played": best_role["games_played"]
    }


def calculate_pressure_rating(general_df):
    """
    Pressure Rating replaces the old Clutch Index idea.

    This does not claim to measure actual overtime/clutch fights.
    It estimates pressure performance using:
    - win rate
    - KDA
    - survivability
    """
    general = general_df.iloc[0]

    winrate = safe_number(general.get("winrate", 0))
    kda = safe_number(general.get("kda", 0))

    deaths_per_game = general.get("average_deaths", None)

    winrate_score = clamp((winrate - 45) / 20)
    kda_score = clamp(kda / 5)

    if deaths_per_game is not None:
        deaths_per_game = safe_number(deaths_per_game)
        survival_score = clamp((10 - deaths_per_game) / 10)
    else:
        survival_score = kda_score

    score = (
        winrate_score * 0.40 +
        kda_score * 0.35 +
        survival_score * 0.25
    )

    return round(clamp(score) * 100)


def pressure_rating_out_of_five(pressure_rating):
    """
    Converts Pressure Rating from 0-100 into a 0-5 scale for the UI.
    """
    pressure_rating = safe_number(pressure_rating)

    return round((pressure_rating / 100) * 5, 1)


def calculate_reliability_score(general_df):
    """
    Reliability Score replaces the old Consistency Score.

    This is based on aggregate data available right now:
    - adjusted win rate
    - KDA
    - total games played

    It does not pretend to measure match-to-match consistency.
    """
    general = general_df.iloc[0]

    games_played = safe_number(general.get("games_played", 0))
    winrate = safe_number(general.get("winrate", 0))
    kda = safe_number(general.get("kda", 0))

    adjusted_wr = adjusted_winrate(
        winrate=winrate,
        games_played=games_played,
        reliable_sample=500
    )

    winrate_score = clamp((adjusted_wr - 40) / 25)
    kda_score = clamp(kda / 5)
    sample_score = clamp(games_played / 1000)

    score = (
        winrate_score * 0.45 +
        kda_score * 0.35 +
        sample_score * 0.20
    )

    return round(clamp(score) * 100)


def assign_reliability_label(reliability_score):
    """
    Turns Reliability Score into readable language.
    """
    reliability_score = safe_number(reliability_score)

    if reliability_score >= 75:
        return "Highly Reliable"

    if reliability_score >= 55:
        return "Reliable"

    if reliability_score >= 35:
        return "Developing"

    return "Unstable"


def calculate_gamestat_score(general_df, heroes_df, roles_df, pressure_rating, flex_rating):
    """
    The main GameStat score shown on the homepage.

    Combines:
    - overall win rate
    - overall KDA
    - top hero confidence
    - best role confidence
    - flex rating
    - pressure rating
    """
    general = general_df.iloc[0]

    winrate = safe_number(general.get("winrate", 0))
    kda = safe_number(general.get("kda", 0))

    winrate_score = clamp((winrate - 40) / 25)
    kda_score = clamp(kda / 5)

    trusted_heroes = heroes_df[heroes_df["games_played"] >= 10]

    if trusted_heroes.empty:
        trusted_heroes = heroes_df

    top_hero_score = safe_number(trusted_heroes["hero_confidence"].max()) / 100
    best_role_score = safe_number(roles_df["role_confidence"].max()) / 100
    flex_score = safe_number(flex_rating) / 100
    pressure_score = safe_number(pressure_rating) / 100

    score = (
        winrate_score * 0.25 +
        kda_score * 0.20 +
        top_hero_score * 0.20 +
        best_role_score * 0.15 +
        flex_score * 0.10 +
        pressure_score * 0.10
    )

    return round(clamp(score) * 100)


def create_performance_snapshot(general_df, heroes_df, roles_df, pressure_rating, flex_rating):
    """
    Performance Snapshot replaces the old Performance Review.

    This compares current strengths across categories instead of pretending
    to show recent improvement over time.
    """
    general = general_df.iloc[0]

    winrate = safe_number(general.get("winrate", 0))
    kda = safe_number(general.get("kda", 0))

    winrate_score = round(clamp((winrate - 40) / 25) * 100)
    kda_score = round(clamp(kda / 5) * 100)

    trusted_heroes = heroes_df[heroes_df["games_played"] >= 10]

    if trusted_heroes.empty:
        trusted_heroes = heroes_df

    top_hero_score = round(safe_number(trusted_heroes["hero_confidence"].max()))
    best_role_score = round(safe_number(roles_df["role_confidence"].max()))

    scores = [
        {
            "key": "winrate_score",
            "label": "Win Rate",
            "score": winrate_score
        },
        {
            "key": "kda_score",
            "label": "KDA",
            "score": kda_score
        },
        {
            "key": "pressure_rating",
            "label": "Pressure",
            "score": pressure_rating
        },
        {
            "key": "flex_rating",
            "label": "Flex",
            "score": flex_rating
        },
        {
            "key": "best_role_score",
            "label": "Best Role",
            "score": best_role_score
        },
        {
            "key": "top_hero_score",
            "label": "Top Hero",
            "score": top_hero_score
        }
    ]

    strongest_area = max(scores, key=lambda item: item["score"])
    weakest_area = min(scores, key=lambda item: item["score"])

    return {
        "scores": scores,
        "strongest_area": strongest_area,
        "weakest_area": weakest_area
    }


def create_ai_review_inputs(summary):
    """
    Packages the completed metrics into a clean object that can later be sent to an LLM.

    The LLM should write the review.
    Python should prepare the facts.
    """
    return {
        "gamestat_score": summary["gamestat_score"],
        "pressure_rating": summary["pressure_rating"],
        "reliability_score": summary["reliability_score"],
        "flex_rating": summary["flex_rating"],
        "flex_label": summary["flex_label"],
        "best_role": summary["role_confidence"]["best_role"],
        "top_heroes": summary["hero_confidence"]["top_heroes"],
        "hero_pool_counts": summary["hero_pool"]["counts"],
        "risk_picks": summary["hero_pool"]["risk_picks"],
        "performance_snapshot": summary["performance_snapshot"]
    }


def create_player_summary(heroes_df, roles_df, general_df):
    """
    Creates the final summary object for the GameStat page.
    """

    flex_rating = calculate_flex_rating(heroes_df)
    flex_label = assign_flex_label(flex_rating)

    pressure_rating = calculate_pressure_rating(general_df)
    pressure_rating_5 = pressure_rating_out_of_five(pressure_rating)

    reliability_score = calculate_reliability_score(general_df)
    reliability_label = assign_reliability_label(reliability_score)

    gamestat_score = calculate_gamestat_score(
        general_df=general_df,
        heroes_df=heroes_df,
        roles_df=roles_df,
        pressure_rating=pressure_rating,
        flex_rating=flex_rating
    )

    best_role = get_best_role(roles_df)

    trusted_heroes = heroes_df[heroes_df["games_played"] >= 10]

    if trusted_heroes.empty:
        trusted_heroes = heroes_df

    top_heroes = (
        trusted_heroes
        .sort_values("hero_confidence", ascending=False)
        .head(5)
        [["hero", "games_played", "winrate", "kda", "hero_confidence", "hero_pool"]]
        .to_dict(orient="records")
    )

    hero_pool_counts = (
        heroes_df["hero_pool"]
        .value_counts()
        .to_dict()
    )

    risk_picks = (
        heroes_df[
            (heroes_df["games_played"] >= 25) &
            (heroes_df["hero_confidence"] < 55)
        ]
        .sort_values("games_played", ascending=False)
        [["hero", "games_played", "winrate", "kda", "hero_confidence"]]
        .head(5)
        .to_dict(orient="records")
    )

    performance_snapshot = create_performance_snapshot(
        general_df=general_df,
        heroes_df=heroes_df,
        roles_df=roles_df,
        pressure_rating=pressure_rating,
        flex_rating=flex_rating
    )

    summary = {
        "gamestat_score": gamestat_score,

        "pressure_rating": pressure_rating,
        "pressure_rating_5": pressure_rating_5,

        "reliability_score": reliability_score,
        "reliability_label": reliability_label,

        "performance_snapshot": performance_snapshot,

        "hero_confidence": {
            "top_heroes": top_heroes
        },

        "flex_rating": flex_rating,
        "flex_label": flex_label,

        "role_confidence": {
            "best_role": best_role,
            "all_roles": roles_df[
                ["role", "games_played", "winrate", "kda", "role_confidence"]
            ].to_dict(orient="records")
        },

        "hero_pool": {
            "counts": hero_pool_counts,
            "risk_picks": risk_picks
        }
    }

    summary["ai_review_inputs"] = create_ai_review_inputs(summary)

    return summary