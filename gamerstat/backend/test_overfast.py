import requests
from pprint import pprint

BASE_URL = "https://overfast-api.tekrop.fr"

# Your BattleTag
PLAYER_ID = "ChakaKhan-11335"


def get_player_summary(player_id):
    url = f"{BASE_URL}/players/{player_id}/summary"

    print(f"\nRequesting:\n{url}\n")

    response = requests.get(url, timeout=15)

    print(f"Status Code: {response.status_code}\n")

    if response.status_code != 200:
        print("Request failed.")
        print(response.text)
        return None

    return response.json()


def main():
    data = get_player_summary(PLAYER_ID)

    if data is None:
        return

    print("========== FULL RESPONSE ==========\n")
    pprint(data)

    print("\n========== TOP LEVEL KEYS ==========\n")

    for key in data.keys():
        print(key)


if __name__ == "__main__":
    main()
