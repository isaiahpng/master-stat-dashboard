from pathlib import Path
import json
import requests


BASE_URL = "https://overfast-api.tekrop.fr"

ANALYSIS_DIR = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = ANALYSIS_DIR / "data" / "raw"

RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)


def save_json(data, file_path):
    """
    Saves Python dictionary data as a JSON file.
    """
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


def fetch_player_summary(player_id):
    """
    Pulls basic player profile data from the API.

    Example:
    username
    avatar
    namecard
    competitive rank
    endorsement
    """
    url = f"{BASE_URL}/players/{player_id}/summary"

    response = requests.get(url, timeout=15)
    response.raise_for_status()

    data = response.json()

    output_path = RAW_DATA_DIR / f"{player_id}_summary.json"
    save_json(data, output_path)

    return data


def fetch_player_stats(player_id):
    """
    Pulls player stats summary data from the API.

    This usually contains:
    general stats
    role stats
    hero stats
    """
    url = f"{BASE_URL}/players/{player_id}/stats/summary"

    response = requests.get(url, timeout=15)
    response.raise_for_status()

    data = response.json()

    output_path = RAW_DATA_DIR / f"{player_id}_stats_summary.json"
    save_json(data, output_path)

    return data


if __name__ == "__main__":
    player_id = "ChakaKhan-11335"

    print("Fetching player summary...")
    fetch_player_summary(player_id)

    print("Fetching player stats...")
    fetch_player_stats(player_id)

    print("Done. Raw data saved in data/raw.")