import json
import csv

# based on the cards csv, fills in the dop json nyeremeny entries
# in csv, do "Igen" on the needed nyeremeny values in its column
# column indexes are hardcoded since no header was given
# put dop.json next to script.

# File paths
json_file = "dop.json"
csv_file = "cards.csv"
output_file = "dop_updated.json"

# Load JSON
with open(json_file, "r", encoding="utf-8") as f:
    cards = json.load(f)

# Build a lookup dictionary for JSON cards by sorszam
json_lookup = {card["data"]["sorszam"]: card for card in cards}

# Read CSV
with open(csv_file, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        if len(row) < 12:
            continue  # skip incomplete rows

        sorszam = row[10].strip()  # CSV 11th column is sorszam
        nyeremeny_value = row[11].strip() if len(row) > 11 else ""

        if nyeremeny_value == "Igen" and sorszam in json_lookup:
            card = json_lookup[sorszam]
            if "nyeremeny" not in card["data"]:
                card["data"]["nyeremeny"] = "1"

# Save updated JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(cards, f, ensure_ascii=False, indent=2)

print(f"Done! Updated JSON saved to: {output_file}")
