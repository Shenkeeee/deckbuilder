import os
from PIL import Image


def convert_images_to_webp(input_folder, output_folder):
    """
    Converts all PNG and JPG images in the input_folder to WEBP format and saves them in the output_folder.

    Args:
        input_folder (str): Path to the folder containing the input images.
        output_folder (str): Path to the folder where the converted images will be saved.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + '.webp')

            with Image.open(input_path) as img:
                img.save(output_path, 'WEBP')
                print(f"Converted {input_path} to {output_path}")

    print("All of the files have been converted.")


if __name__ == "__main__":
    input_folder = r'C:\Users\ASUS\Documents\Suli\Hobbi2\Programming\Andris\picsToConvert'
    output_folder = r'C:\Users\ASUS\Documents\Suli\Hobbi2\Programming\Andris\picsConverted'
    convert_images_to_webp(input_folder, output_folder)