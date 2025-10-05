from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import io
import time
import torch

class CaptionService:
    def __init__(self):
        self.processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        self.model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

    def generate_caption(self, image_file):
        # Ensure the file pointer is at the start
        try:
            image_file.seek(0)
        except Exception:
            pass
        raw_image = Image.open(io.BytesIO(image_file.read())).convert('RGB')
        
        # conditional image captioning
        # text = "a photography of"
        # inputs = self.processor(raw_image, text, return_tensors={"pt": True})

        # unconditional image captioning
        # Use correct API: return_tensors should be a string like "pt"
        inputs = self.processor(raw_image, return_tensors="pt")

        # Add stochastic decoding so Regenerate yields different captions
        # Set a different seed each call
        try:
            torch.manual_seed(int(time.time() * 1000) % (2**31 - 1))
        except Exception:
            pass
        out = self.model.generate(
            **inputs,
            max_new_tokens=30,
            do_sample=True,
            top_p=0.9,
            temperature=0.8,
            repetition_penalty=1.1,
            num_beams=1,
        )
        caption = self.processor.decode(out[0], skip_special_tokens=True)
        return caption
