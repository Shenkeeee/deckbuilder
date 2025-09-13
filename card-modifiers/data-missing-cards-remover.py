import os
import json

# removes cards from json that do not have a picture in the given folder
# used when a release does not release all of its cards yet
# put dop.json next to script.
def filter_cards(json_filename, images_folder, release="Phy26", max_number=999, output_filename="filtered.json"):
    base_dir = os.path.dirname(os.path.abspath(__file__))  # same folder as script
    json_path = os.path.join(base_dir, json_filename)
    images_path = os.path.join(base_dir, images_folder)
    output_path = os.path.join(base_dir, output_filename)

    # 1. Get existing filenames (without extension)
    existing_files = {f.split('.')[0] for f in os.listdir(images_path) if f.endswith(".webp")}

    # 2. Load JSON (expecting an array of cards)
    with open(json_path, "r", encoding="utf-8") as f:
        cards = json.load(f)

    filtered = []
    for card in cards:
        card_id = card.get("id", "")
        if not card_id.startswith(release):
            continue  # skip other releases

        # Parse number part, e.g. "Phy26-055" -> 55
        try:
            num = int(card_id.split("-")[1])
        except (IndexError, ValueError):
            continue

        if num > max_number:
            continue

        if card_id in existing_files:
            filtered.append(card)

    # 3. Save filtered JSON
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"✅ Filtered {len(filtered)} cards saved to {output_filename}")


filter_cards("dop.json", r"C:\Users\ASUS\Downloads\26-fixed", release="Phy26", max_number=135, output_filename="Phy26_filtered.json")
