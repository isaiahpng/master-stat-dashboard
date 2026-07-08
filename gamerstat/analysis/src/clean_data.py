from pathlib import Path
import json
import pandas as pd


ANALYSIS_DIR = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = ANALYSIS_DIR / "data" / "raw"
PROCESSED_DATA_DIR = ANALYSIS_DIR / "data" / "processed"

PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_json(file_path):
    """
    Loads a JSON file and returns it as a Python dictionary.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def flatten_nested_columns(df):
    """
    Some API fields may be nested dictionaries.

    Example:
    average: {
        eliminations: 19.1,
        deaths: 7.5
    }

    This function turns that into:
    average_eliminations
    average_deaths
    """
    df = df.copy()

    nested_columns = []

    for column in df.columns:
        has_dict_values = df[column].apply(lambda value: isinstance(value, dict)).any()

        if has_dict_values:
            nested_columns.append(column)

    for column in nested_columns:
        nested_df = pd.json_normalize(df[column])
        nested_df = nested_df.add_prefix(f"{column}_")

        df = df.drop(columns=[column])
        df = pd.concat([df, nested_df], axis=1)

    return df


def create_table_from_dict(data_dict, index_name):
    """
    Converts a dictionary of dictionaries into a DataFrame.

    Example:
    data["heroes"] becomes one row per hero.
    """
    df = pd.DataFrame.from_dict(data_dict, orient="index")
    df = df.reset_index()
    df = df.rename(columns={"index": index_name})

    df = flatten_nested_columns(df)

    return df


def clean_numeric_columns(df):
    """
    Attempts to convert columns into numeric values when possible.

    If a column cannot be converted, it leaves it alone.
    """
    df = df.copy()

    text_columns = ["hero", "role"]

    for column in df.columns:
        if column in text_columns:
            continue

        try:
            df[column] = pd.to_numeric(df[column])
        except (ValueError, TypeError):
            pass

    return df


def create_heroes_table(stats_data):
    """
    Creates a hero-level table from the raw stats JSON.
    """
    heroes_df = create_table_from_dict(stats_data["heroes"], "hero")
    heroes_df = clean_numeric_columns(heroes_df)

    return heroes_df


def create_roles_table(stats_data):
    """
    Creates a role-level table from the raw stats JSON.
    """
    roles_df = create_table_from_dict(stats_data["roles"], "role")
    roles_df = clean_numeric_columns(roles_df)

    return roles_df


def create_general_table(stats_data):
    """
    Creates a one-row table for general player stats.
    """
    general_data = stats_data["general"]

    general_df = pd.DataFrame([general_data])
    general_df = flatten_nested_columns(general_df)
    general_df = clean_numeric_columns(general_df)

    return general_df


def process_player_stats(player_id):
    """
    Loads raw player stats JSON, creates clean tables,
    and saves the processed CSV files.
    """
    raw_file_path = RAW_DATA_DIR / f"{player_id}_stats_summary.json"

    stats_data = load_json(raw_file_path)

    heroes_df = create_heroes_table(stats_data)
    roles_df = create_roles_table(stats_data)
    general_df = create_general_table(stats_data)

    heroes_df.to_csv(PROCESSED_DATA_DIR / f"{player_id}_heroes.csv", index=False)
    roles_df.to_csv(PROCESSED_DATA_DIR / f"{player_id}_roles.csv", index=False)
    general_df.to_csv(PROCESSED_DATA_DIR / f"{player_id}_general.csv", index=False)

    return heroes_df, roles_df, general_df


if __name__ == "__main__":
    player_id = "ChakaKhan-11335"

    heroes_df, roles_df, general_df = process_player_stats(player_id)

    print("Heroes table:")
    print(heroes_df.head())

    print("\nRoles table:")
    print(roles_df.head())

    print("\nGeneral table:")
    print(general_df.head())