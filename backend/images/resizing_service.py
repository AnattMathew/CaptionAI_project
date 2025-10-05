from PIL import Image, ImageDraw, ImageFont
import io

class ImageResizingService:
    def resize_image(self, image_file, target_platform: str, caption_text: str | None = None):
        try:
            img = Image.open(image_file)
            original_width, original_height = img.size
            
            # Define aspect ratios for different platforms
            aspect_ratios = {
                "instagram": (1, 1),   # Square
                "facebook": (1.91, 1), # Landscape (e.g., 1200x628)
                "twitter": (16, 9)     # Wide
            }
            
            if target_platform.lower() not in aspect_ratios:
                print(f"Warning: Unsupported platform for resizing: {target_platform}. Returning original image.")
                return self._save_image_to_bytes(img, image_file.format)

            target_aspect_ratio = aspect_ratios[target_platform.lower()]
            target_width_ratio, target_height_ratio = target_aspect_ratio

            # Calculate new dimensions while maintaining aspect ratio and fitting within original size
            if (original_width / original_height) > (target_width_ratio / target_height_ratio):
                # Original is wider than target, fit by height
                new_height = original_height
                new_width = int(new_height * (target_width_ratio / target_height_ratio))
            else:
                # Original is taller than target, fit by width
                new_width = original_width
                new_height = int(new_width * (target_height_ratio / target_width_ratio))
            
            # Resize the image (if necessary) and crop to the new aspect ratio
            # For simplicity, we'll just resize to fit within the new dimensions and crop center.
            # A more advanced implementation might offer different cropping options.
            img = img.resize((new_width, new_height), Image.LANCZOS)

            # If the image is still not the exact aspect ratio due to integer division,
            # we can crop it. For now, we'll assume resize handles it sufficiently, or that
            # minor discrepancies are acceptable given the prompt's focus on resizing.

            # Ensure the image is in RGB mode if it's not (e.g., PNGs with alpha channel)
            if img.mode == 'RGBA':
                img = img.convert('RGB')

            # If caption is requested, overlay it based on platform style
            if caption_text:
                img = self._overlay_caption(img, caption_text, target_platform)
            return self._save_image_to_bytes(img, getattr(image_file, 'format', 'JPEG'))
        except Exception as e:
            print(f"Error resizing image: {e}")
            image_file.seek(0) # Reset file pointer
            return image_file.read() # Return original image bytes on error

    def _save_image_to_bytes(self, img: Image.Image, original_format: str) -> bytes:
        img_byte_arr = io.BytesIO()
        # Save as JPEG by default, or original format if it's PNG
        save_format = original_format if original_format in ['PNG', 'JPEG'] else 'JPEG'
        img.save(img_byte_arr, format=save_format)
        return img_byte_arr.getvalue()

    def _overlay_caption(self, img: Image.Image, caption_text: str, platform: str) -> Image.Image:
        draw = ImageDraw.Draw(img)
        width, height = img.size

        # Style presets per platform
        platform = (platform or 'instagram').lower()
        if platform == 'instagram':
            box_opacity = 140
            padding = int(0.04 * width)
            font_size = max(18, int(width * 0.045))
        elif platform == 'facebook':
            box_opacity = 120
            padding = int(0.035 * width)
            font_size = max(16, int(width * 0.04))
        else:  # twitter
            box_opacity = 130
            padding = int(0.03 * width)
            font_size = max(16, int(width * 0.038))

        # Load default font
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except Exception:
            font = ImageFont.load_default()

        # Wrap text to fit width (use textbbox for accurate measurement)
        max_text_width = width - 2 * padding
        lines = []
        words = caption_text.split()
        line = ""
        for word in words:
            test = (line + " " + word).strip()
            bbox = draw.textbbox((0, 0), test, font=font)
            w = bbox[2] - bbox[0]
            if w <= max_text_width:
                line = test
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)

        bbox_line = draw.textbbox((0, 0), "Ay", font=font)
        line_height = bbox_line[3] - bbox_line[1]
        text_height = line_height * len(lines)
        box_height = text_height + padding
        # Position: bottom overlay
        box_y0 = height - box_height
        box = Image.new('RGBA', (width, box_height), (0, 0, 0, box_opacity))
        img = img.convert('RGBA')
        img.alpha_composite(box, (0, box_y0))

        # Draw text
        y = box_y0 + (padding // 2)
        for ln in lines:
            draw = ImageDraw.Draw(img)
            draw.text((padding, y), ln, font=font, fill=(255, 255, 255, 255))
            y += line_height

        return img.convert('RGB')
