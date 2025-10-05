from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from .serializers import ImageUploadSerializer
from .models import ImageUpload
from .utils import format_image_for_platform, overlay_caption_on_image  # ✅ import utils
import requests
import os

HF_API_URL = "https://api-inference.huggingface.co/models/<model-id>"  # e.g. a BLIP model
HEADERS = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}

class GenerateCaptionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('image')
        platform = request.data.get('platform', 'instagram')

        # save uploaded image object
        img = ImageUpload.objects.create(image=file_obj, platform=platform)

        # send bytes to Hugging Face inference API
        response = requests.post(HF_API_URL, headers=HEADERS, data=file_obj.read())
        result = response.json()
        caption = result.get('generated_text') or result.get('caption') or str(result)

        # save caption
        img.caption = caption
        img.save()

        # ✅ Call resize + overlay functions
        formatted_path = format_image_for_platform(img.image.path, platform=platform)
        overlay_caption_on_image(formatted_path, caption)

        # ✅ Save formatted image back into model
        # replace `uploads/` with `formatted/` in relative path
        relative_path = formatted_path.split("media\\")[-1] if "media" in formatted_path else formatted_path
        img.formatted_image = relative_path
        img.save()

        return Response({
            "id": img.id,
            "caption": caption,
            "formatted_url": request.build_absolute_uri(img.formatted_image.url) if img.formatted_image else None
        })
