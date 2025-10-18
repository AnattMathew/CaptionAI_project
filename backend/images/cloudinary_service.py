import cloudinary
import cloudinary.uploader
import cloudinary.api
from django.conf import settings
import os

class CloudinaryService:
    def __init__(self):
        # Configure Cloudinary (you'll need to set these environment variables)
        cloudinary.config(
            cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
            api_key=os.environ.get('CLOUDINARY_API_KEY'),
            api_secret=os.environ.get('CLOUDINARY_API_SECRET')
        )
    
    def upload_image(self, image_file, public_id=None):
        """
        Upload an image to Cloudinary and return the public URL
        """
        try:
            # Upload the image
            result = cloudinary.uploader.upload(
                image_file,
                public_id=public_id,
                folder="captionai",  # Organize images in a folder
                resource_type="image"
            )
            
            # Return the public URL
            return result['secure_url']
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            return None
    
    def upload_from_url(self, image_url, public_id=None):
        """
        Upload an image from a URL to Cloudinary
        """
        try:
            result = cloudinary.uploader.upload(
                image_url,
                public_id=public_id,
                folder="captionai",
                resource_type="image"
            )
            return result['secure_url']
        except Exception as e:
            print(f"Error uploading from URL to Cloudinary: {e}")
            return None
