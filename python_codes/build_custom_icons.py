from PIL import Image, ImageDraw
import os

current_dir = os.path.dirname(os.path.abspath(__file__)) + "/../public/custom"

items = 3
colors: list[str] = ["red", "#80ed80", "yellow", "gray", "white"]

for i in range(items):
    icon_path_begin: str = current_dir + "/icon_" + str(i)
    icon_path = icon_path_begin + ".png"
    icon = Image.open(icon_path).resize((320, 320))

    for color in colors:
        final_path = icon_path_begin + "_" + color.removeprefix("#") + ".png"
        if not os.path.exists(final_path):
            image = Image.new("RGBA", (512, 515), "#00000000")
            ImageDraw.Draw(image).ellipse(
                xy=(0, 0, 512, 512), fill=color, outline="white", width=20
            )
            image.paste(icon, (96, 96), icon)
            image.save(final_path)
