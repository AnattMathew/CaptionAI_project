import openai
import base64
import io
from PIL import Image
import os

class CaptionService:
    def __init__(self):
        # Initialize OpenAI client
        openai.api_key = os.environ.get('OPENAI_API_KEY')
        if not openai.api_key:
            print("Warning: OPENAI_API_KEY not found. Caption generation will not work.")

    def generate_caption(self, image_file):
        try:
            # Ensure the file pointer is at the start
            image_file.seek(0)
            
            # Convert image to base64
            image_data = image_file.read()
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            # Use OpenAI Vision API for image captioning
            response = openai.ChatCompletion.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "Generate a creative, engaging caption for this image that would be perfect for social media. Make it descriptive, interesting, and under 100 words."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=150
            )
            
            caption = response.choices[0].message.content.strip()
            return caption
            
        except Exception as e:
            print(f"Error generating caption with OpenAI: {e}")
            # Fallback to a simple description
            return "A beautiful image that tells a story worth sharing."
