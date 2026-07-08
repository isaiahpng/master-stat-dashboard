from pathlib import Path
import matplotlib.pyplot as plt


ANALYSIS_DIR = Path(__file__).resolve().parents[1]
FIGURES_DIR = ANALYSIS_DIR / "outputs" / "figures"

FIGURES_DIR.mkdir(parents=True, exist_ok=True)


def save_plot(file_name):
    """
    Saves the current matplotlib chart without opening it.
    """
    output_path = FIGURES_DIR / file_name

    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()


def plot_top_hero_confidence(heroes_df, top_n=10):
    """
    Bar chart showing the top heroes by Hero Confidence.
    """
    trusted_heroes = heroes_df[heroes_df["games_played"] >= 10]

    if trusted_heroes.empty:
        trusted_heroes = heroes_df

    top_heroes = (
        trusted_heroes
        .sort_values("hero_confidence", ascending=False)
        .head(top_n)
    )

    plt.figure(figsize=(10, 6))
    plt.bar(top_heroes["hero"], top_heroes["hero_confidence"])

    plt.title("Top Heroes by Hero Confidence")
    plt.xlabel("Hero")
    plt.ylabel("Hero Confidence")

    plt.xticks(rotation=45, ha="right")

    save_plot("top_hero_confidence.png")


def plot_role_confidence(roles_df):
    """
    Bar chart comparing role confidence.
    """
    sorted_roles = roles_df.sort_values("role_confidence", ascending=False)

    plt.figure(figsize=(8, 5))
    plt.bar(sorted_roles["role"], sorted_roles["role_confidence"])

    plt.title("Role Confidence by Role")
    plt.xlabel("Role")
    plt.ylabel("Role Confidence")

    save_plot("role_confidence.png")


def plot_hero_pool_counts(heroes_df):
    """
    Bar chart showing how many heroes fall into each hero pool segment.
    """
    pool_counts = heroes_df["hero_pool"].value_counts()

    plt.figure(figsize=(8, 5))
    plt.bar(pool_counts.index, pool_counts.values)

    plt.title("Hero Pool Segment Counts")
    plt.xlabel("Hero Pool")
    plt.ylabel("Number of Heroes")

    plt.xticks(rotation=30, ha="right")

    save_plot("hero_pool_counts.png")


def plot_winrate_vs_games(heroes_df):
    """
    Scatterplot comparing win rate and games played.
    """
    plt.figure(figsize=(9, 6))
    plt.scatter(heroes_df["games_played"], heroes_df["winrate"])

    plt.title("Hero Win Rate vs Games Played")
    plt.xlabel("Games Played")
    plt.ylabel("Win Rate")

    save_plot("winrate_vs_games.png")


def plot_kda_vs_winrate(heroes_df):
    """
    Scatterplot comparing KDA and win rate.
    """
    plt.figure(figsize=(9, 6))
    plt.scatter(heroes_df["kda"], heroes_df["winrate"])

    plt.title("Hero KDA vs Win Rate")
    plt.xlabel("KDA")
    plt.ylabel("Win Rate")

    save_plot("kda_vs_winrate.png")