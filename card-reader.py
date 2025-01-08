import os
import shutil


def rename_files(input_path, output_path, file_prefix, file_extension):
    """
    Recursively scans for .jpg files in the input_path, renames them according to a given pattern
    by extracting the number before the first underscore, and moves them to the output_path.

    Args:
        input_path (str): The path to recursively search for .jpg files.
        output_path (str): The path to save the renamed files.
        file_prefix (str): The prefix to use for the renamed files.
        file_extension (str): The new file extension for the renamed files.
    """
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    for root, _, files in os.walk(input_path):
        for file in files:
            if file.lower().endswith('.jpg'):
                # Extract the number before the first underscore in the filename
                try:
                    number = file.split('_', 1)[0]  # Get the part before the first "_"
                    if not number.isdigit():
                        print(f"Skipping file without valid number: {file}")
                        continue
                except IndexError:
                    print(f"Skipping malformed filename: {file}")
                    continue

                # Build new file name
                new_filename = f"{file_prefix}{int(number):03}.{file_extension}"
                src_file = os.path.join(root, file)
                dest_file = os.path.join(output_path, new_filename)

                # Copy and rename the file
                shutil.copy(src_file, dest_file)
                print(f"Copied: {src_file} -> {dest_file}")

    print("All files processed.")


def check_for_missing_numbers(output_path, file_prefix, file_extension):
    """
    Checks the output folder for missing numbers in the sequence of renamed files.

    Args:
        output_path (str): The folder to check for renamed files.
        file_prefix (str): The prefix of the renamed files.
        file_extension (str): The file extension of the renamed files.

    Returns:
        None: Prints the status of the sequence check.
    """
    # List all files in the output folder that match the pattern
    renamed_files = [
        file for file in os.listdir(output_path)
        if file.startswith(file_prefix) and file.endswith(f".{file_extension}")
    ]

    # Extract the numbers from the filenames
    numbers = sorted(int(file[len(file_prefix):-len(f".{file_extension}")]) for file in renamed_files)

    # Check for gaps in the numbers
    missing_numbers = []
    for i in range(numbers[0], numbers[-1] + 1):
        if i not in numbers:
            missing_numbers.append(i)

    if missing_numbers:
        print(f"Missing numbers: {missing_numbers}")
    else:
        print("No missing numbers. The sequence is complete.")


# Example usage
if __name__ == "__main__":
    # Customize these variables for your use case
    input_folder = r"C:\Users\ASUS\Downloads\2024esLapok\2024"  # Folder to search for .jpg files
    output_folder = r"C:\Users\ASUS\Downloads\2024esLapok\2024-fixed"  # Folder to save renamed files
    prefix = "SL24-"  # Prefix for the new filenames
    extension = "png"  # Desired file extension for the output (e.g., "png")

    # Rename files
    rename_files(input_folder, output_folder, prefix, extension)

    # Check for missing numbers
    check_for_missing_numbers(output_folder, prefix, extension)
