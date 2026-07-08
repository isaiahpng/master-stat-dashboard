from pathlib import Path
import json
import numpy as np

from src.fetch_data import fetch_player_summary, fetch_player_stats
from src.clean_data import process_player_stats
from src.metrics import add_hero_metrics, add_role_metrics, create_player_summary
from src.visuals import (
    plot_top_hero_confidence,
    plot_role_confidence,
    plot_hero_pool_counts,
    plot_winrate_vs_games,
    plot_kda_vs_winrate
)


ANALYSIS_DIR = Path(__file__).resolve().parent
PROCESSED_DATA_DIR = ANALYSIS_DIR / "data" / "processed"


def convert_numpy_types(value):
    """
    Converts Pandas/Numpy values into normal Python values
    so json.dump can save them.
    """
    if isinstance(value, np.integer):
        return int(value)

    if isinstance(value, np.floating):
        return float(value)

    if isinstance(value, np.ndarray):
        return value.tolist()

    raise TypeError(f"Object of type {type(value).__name__} is not JSON serializable")


def save_summary(player_id, summary):
    """
    Saves the final GameStat summary as JSON.
    """
    output_path = PROCESSED_DATA_DIR / f"{player_id}_gamestat_summary.json"

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(summary, file, indent=4, default=convert_numpy_types)


def main():
    player_id = "ChakaKhan-11335"

    print(f"Starting GameStat analysis for {player_id}...")

    print("\n1. Fetching raw API data...")
    fetch_player_summary(player_id)
    fetch_player_stats(player_id)

    print("\n2. Cleaning raw data into tables...")
    heroes_df, roles_df, general_df = process_player_stats(player_id)

    print("\n3. Calculating GameStat metrics...")
    heroes_df = add_hero_metrics(heroes_df)
    roles_df = add_role_metrics(roles_df)

    heroes_df.to_csv(
        PROCESSED_DATA_DIR / f"{player_id}_heroes_scored.csv",
        index=False
    )

    roles_df.to_csv(
        PROCESSED_DATA_DIR / f"{player_id}_roles_scored.csv",
        index=False
    )

    print("\n4. Creating player summary...")
    summary = create_player_summary(
        heroes_df=heroes_df,
        roles_df=roles_df,
        general_df=general_df
    )

    save_summary(player_id, summary)

    print("\n5. Creating visuals...")
    plot_top_hero_confidence(heroes_df)
    plot_role_confidence(roles_df)
    plot_hero_pool_counts(heroes_df)
    plot_winrate_vs_games(heroes_df)
    plot_kda_vs_winrate(heroes_df)

    print("\nAnalysis complete.")

    print("\nMain GameStat Metrics:")
    print(f"GameStat Score: {summary['gamestat_score']}")
    print(
        f"Pressure Rating: {summary['pressure_rating']} "
        f"({summary['pressure_rating_5']} / 5)"
    )
    print(
        f"Reliability Score: {summary['reliability_score']} "
        f"- {summary['reliability_label']}"
    )

    print("\nPerformance Snapshot:")
    strongest = summary["performance_snapshot"]["strongest_area"]
    weakest = summary["performance_snapshot"]["weakest_area"]

    print(
        f"Strongest Area: {strongest['label']} "
        f"({strongest['score']})"
    )

    print(
        f"Weakest Area: {weakest['label']} "
        f"({weakest['score']})"
    )

    print("\nTop Heroes:")
    for hero in summary["hero_confidence"]["top_heroes"]:
        print(
            f"{hero['hero']}: "
            f"{hero['hero_confidence']} confidence, "
            f"{hero['winrate']}% win rate, "
            f"{hero['kda']} KDA, "
            f"{hero['hero_pool']}"
        )

    print("\nFlex Rating:")
    print(f"{summary['flex_rating']} - {summary['flex_label']}")

    print("\nBest Role:")
    best_role = summary["role_confidence"]["best_role"]
    print(
        f"{best_role['role']} "
        f"({best_role['role_confidence']} confidence, "
        f"{best_role['winrate']}% win rate, "
        f"{best_role['kda']} KDA)"
    )

    print("\nHero Pool:")
    for pool_name, count in summary["hero_pool"]["counts"].items():
        print(f"{pool_name}: {count}")

    print("\nRisk Picks:")
    if len(summary["hero_pool"]["risk_picks"]) == 0:
        print("No major risk picks found.")
    else:
        for hero in summary["hero_pool"]["risk_picks"]:
            print(
                f"{hero['hero']}: "
                f"{hero['hero_confidence']} confidence, "
                f"{hero['games_played']} games"
            )


if __name__ == "__main__":
    main()