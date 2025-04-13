from PIL import Image, ImageDraw
import os
import re
import numpy as np


def crop_edges_rounded(img, border_range=(127, 132), corner_radius=50):
    """
    Crops the edges of the image that fall within the specified color range and applies rounded corners.

    Args:
        img (PIL.Image.Image): The image to be cropped.
        border_range (tuple): The inclusive range of RGB values to be considered as the border.
        corner_radius (int): The radius of the rounded corners.

    Returns:
        PIL.Image.Image: The cropped image with rounded corners.
    """
    # Convert to RGB and NumPy array for precise color checks
    img = img.convert("RGB")
    img_array = np.array(img)

    # Create a mask for pixels within the border range
    mask = (
        (img_array >= border_range[0]) & (img_array <= border_range[1])
    ).all(axis=-1)

    # Find the bounding box of the non-border region
    coords = np.argwhere(~mask)  # Locate non-border pixels
    if coords.size == 0:
        return img  # Return the original image if all pixels are in the range

    # Determine the bounding box
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0) + 1  # Add 1 to include the last pixel

    # Crop the image to the bounding box
    cropped_img = img.crop((x_min, y_min, x_max, y_max))

    # Create a rounded mask
    width, height = cropped_img.size
    rounded_mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(rounded_mask)
    draw.rounded_rectangle(
        [(0, 0), (width, height)], radius=corner_radius, fill=255
    )

    # Apply the rounded mask to the cropped image
    rounded_img = Image.new("RGBA", cropped_img.size)
    rounded_img.paste(cropped_img, (0, 0), rounded_mask)

    return rounded_img


def rename_and_compress_files(input_path, output_path, file_prefix, file_extension, quality=85, resize_to=None, crop_borders=False, border_range=(127, 132), corner_radius=50):
    """
    Recursively scans for .jpg files in the input_path, compresses and renames them according to a given pattern,
    and moves them to the output_path. Optionally crops borders in a specific color range with rounded corners.

    Args:
        input_path (str): The path to recursively search for .jpg files.
        output_path (str): The path to save the renamed and compressed files.
        file_prefix (str): The prefix to use for the renamed files.
        file_extension (str): The new file extension for the renamed files.
        quality (int): The quality of the output images (1-100). Higher is better quality.
        resize_to (tuple): A tuple (width, height) for the new size. 
                           If None, no resizing is applied.
        crop_borders (bool): Whether to crop edges in a specific color range with rounded corners.
        border_range (tuple): The inclusive range of RGB values for border detection.
        corner_radius (int): Radius of rounded corners to apply after cropping.
    """
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    for root, _, files in os.walk(input_path):
        for file in files:
            if file.lower().endswith('.jpg'):
                # Extract number from filename (e.g., "135" from "135_paradoxland_500.jpg")
                match = re.search(r'(\d+)_', file)
                if match:
                    number = match.group(1)
                    new_filename = f"{file_prefix}{int(number):03}.{file_extension}"
                else:
                    # Default fallback if no number is found
                    new_filename = f"{file_prefix}unknown.{file_extension}"

                src_file = os.path.join(root, file)
                dest_file = os.path.join(output_path, new_filename)

                try:
                    # Open the image
                    with Image.open(src_file) as img:
                        # Resize the image to fixed dimensions while keeping aspect ratio if resize_to is given
                        if resize_to:
                            img.thumbnail(resize_to)

                        # Optionally crop borders with rounded corners
                        if crop_borders:
                            img = crop_edges_rounded(img, border_range, corner_radius)

                        # Save the image with compression
                        img.save(dest_file, file_extension, quality=quality)
                        print(f"Processed and saved: {src_file} -> {dest_file}")
                except Exception as e:
                    print(f"Error processing file {file}: {e}")

    print("All files processed and compressed.")


if __name__ == "__main__":
    input_folder = r"C:\Users\ASUS\Downloads\2025Lapok\ob25jav"  # Folder to search for .jpg files
    output_folder = input_folder + "-fixed"  # Folder to save renamed files
    prefix = "Ob25-"  # Prefix for the new filenames
    extension = "webp"  # Desired file extension for the output (e.g., "png")
    image_quality = 80  # Compression quality (1-100). Lower means more compression.
    resize_to = (800, 800)  # Resize images to fit within x times x while maintaining aspect ratio. Set to None for no resizing.
    crop_borders = True  # Enable border cropping
    border_range = (88, 133)  # Specify the border range (inclusive)
    corner_radius = 35  # Radius for rounded corners

    # Rename and compress files with border cropping and rounded corners
    rename_and_compress_files(input_folder, output_folder, prefix, extension, quality=image_quality, resize_to=resize_to, crop_borders=crop_borders, border_range=border_range, corner_radius=corner_radius)
