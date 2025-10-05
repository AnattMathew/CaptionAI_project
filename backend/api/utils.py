from PIL import Image, ImageOps, ImageDraw, ImageFont
import os

PLATFORM_SIZES = {
    'instagram': (1080, 1080),
    'facebook': (1200, 630),
    'twitter': (1200, 675),
}

def format_image_for_platform(input_path, platform='instagram'):
    target = PLATFORM_SIZES.get(platform, (1080,1080))
    img = Image.open(input_path).convert('RGB')
    img.thumbnail(target, Image.ANTIALIAS)

    # create background and paste centered (padding)
    background = Image.new('RGB', target, (255,255,255))
    x = (target[0] - img.width) // 2
    y = (target[1] - img.height) // 2
    background.paste(img, (x, y))

    # optional: overlay caption later
    out_path = input_path.replace('uploads/', 'formatted/')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    background.save(out_path, format='JPEG', quality=95)
    return out_path

def overlay_caption_on_image(image_path, caption_text):
    img = Image.open(image_path).convert('RGB')
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    text_w, text_h = draw.textsize(caption_text, font=font)
    x = (img.width - text_w) // 2
    y = img.height - text_h - 20
    # translucent rectangle
    draw.rectangle((x-10,y-10,x+text_w+10,y+10), fill=(0,0,0,160))
    draw.text((x,y), caption_text, font=font, fill=(255,255,255))
    img.save(image_path)
