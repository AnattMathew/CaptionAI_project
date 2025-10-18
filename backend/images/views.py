from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ImageUploadSerializer
from .models import ImageUpload
from .caption_service import CaptionService
from .styling_service import CaptionStylingService
from .translation_service import CaptionTranslationService
from .resizing_service import ImageResizingService
from django.core.files.base import ContentFile  # ✅ Correct location
import os
import requests
import io


# Create your views here.

class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            image_file = request.data.get('image')

            if not image_file:
                return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

            # File type and size validation
            if image_file.content_type not in ['image/jpeg', 'image/png']:
                return Response({'error': 'Unsupported file type. Only JPEG and PNG are allowed.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if image_file.size > 10 * 1024 * 1024:  # 10MB
                return Response({'error': 'File size exceeds 10MB limit.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Save image only (upload-only endpoint)
            image_instance = serializer.save()
            return Response(ImageUploadSerializer(image_instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


_caption_service_singleton = None

def get_caption_service():
    global _caption_service_singleton
    if _caption_service_singleton is None:
        _caption_service_singleton = CaptionService()
    return _caption_service_singleton


class GenerateCaptionView(APIView):
    def post(self, request, *args, **kwargs):
        image_id = request.data.get('image_id')
        if not image_id:
            return Response({'error': 'image_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_instance = ImageUpload.objects.get(id=image_id)
        except ImageUpload.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        if not image_instance.image:
            return Response({'error': 'No image associated with this record'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate caption from stored image
        image_instance.image.open('rb')
        try:
            caption_service = get_caption_service()
            caption = caption_service.generate_caption(image_instance.image)
            image_instance.original_caption = caption  # Store original caption
            image_instance.caption = caption
            image_instance.save()
        except Exception as e:
            return Response({'error': f'caption_generation_failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            image_instance.image.close()

        return Response({'id': image_instance.id, 'caption': image_instance.caption}, status=status.HTTP_200_OK)


class StyleCaptionView(APIView):
    def post(self, request, *args, **kwargs):
        image_id = request.data.get('image_id')
        style = request.data.get('style')
        if not image_id or not style:
            return Response({'error': 'image_id and style are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_instance = ImageUpload.objects.get(id=image_id)
        except ImageUpload.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        if not image_instance.original_caption:
            return Response({'error': 'No caption to style. Generate caption first.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Always style from the original caption to avoid cumulative styling
            styled = CaptionStylingService().style_caption(image_instance.original_caption, style)
            image_instance.caption_style = style
            image_instance.caption = styled
            image_instance.save()
        except Exception as e:
            return Response({'error': f'styling_failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'id': image_instance.id,
            'caption': image_instance.caption,
            'style': image_instance.caption_style
        }, status=status.HTTP_200_OK)


class TranslateCaptionView(APIView):
    def post(self, request, *args, **kwargs):
        image_id = request.data.get('image_id')
        target_language = request.data.get('target_language')
        if not image_id or not target_language:
            return Response({'error': 'image_id and target_language are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_instance = ImageUpload.objects.get(id=image_id)
        except ImageUpload.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        if not image_instance.caption:
            return Response({'error': 'No caption to translate. Generate or style caption first.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            translated = CaptionTranslationService().translate_caption(image_instance.caption, target_language)
            print(f"Translation successful: {translated}")
        except Exception as e:
            print(f"Translation error: {e}")
            translated = f"[{target_language}] {image_instance.caption}"

        image_instance.translated_caption = translated
        image_instance.save()

        return Response({
            'id': image_instance.id,
            'translated_caption': image_instance.translated_caption
        }, status=status.HTTP_200_OK)


class ResizeImageView(APIView):
    def post(self, request, *args, **kwargs):
        image_id = request.data.get('image_id')
        target_platform = request.data.get('target_platform')
        if not image_id or not target_platform:
            return Response({'error': 'image_id and target_platform are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image_instance = ImageUpload.objects.get(id=image_id)
        except ImageUpload.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)

        if not image_instance.image:
            return Response({'error': 'No image to resize.'}, status=status.HTTP_400_BAD_REQUEST)

        image_instance.image.open('rb')
        try:
            service = ImageResizingService()
            resized_bytes = service.resize_image(image_instance.image, target_platform, None)

            image_instance.image.save(
                f"resized_{image_instance.image.name.split('/')[-1]}",
                ContentFile(resized_bytes),
                save=True
            )
            image_instance.target_platform = target_platform
            image_instance.save()

        except Exception as e:
            return Response({'error': f'resize_failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            image_instance.image.close()

        # Get the public URL for the resized image
        request_scheme = request.scheme
        request_host = request.get_host()
        public_url = f"{request_scheme}://{request_host}{image_instance.image.url}"
        
        return Response({
            'id': image_instance.id,
            'image': image_instance.image.url,
            'public_url': public_url,
            'target_platform': target_platform
        }, status=status.HTTP_200_OK)


class InstagramShareView(APIView):
    def post(self, request, *args, **kwargs):
        image_url = request.data.get('image_url')
        caption = request.data.get('caption') or ''
        if not image_url:
            return Response({'error': 'image_url is required'}, status=status.HTTP_400_BAD_REQUEST)

        ig_account_id = os.environ.get('IG_BUSINESS_ACCOUNT_ID')
        access_token = os.environ.get('INSTAGRAM_ACCESS_TOKEN')

        if not ig_account_id or not access_token or ig_account_id == 'your_instagram_business_account_id' or access_token == 'your_instagram_access_token':
            return Response({
                'error': 'Instagram API not configured. To enable direct Instagram posting: 1) Create a Facebook Business account, 2) Connect your Instagram account, 3) Create a Facebook App, 4) Get Instagram Business Account ID and Access Token, 5) Set IG_BUSINESS_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN environment variables.'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Step 1: Create media container
            create_resp = requests.post(
                f'https://graph.facebook.com/v19.0/{ig_account_id}/media',
                data={
                    'image_url': image_url,
                    'caption': caption,
                    'access_token': access_token,
                },
                timeout=30,
            )
            if not create_resp.ok:
                return Response({'error': 'media_create_failed', 'detail': create_resp.text}, status=create_resp.status_code)

            container_id = create_resp.json().get('id')
            if not container_id:
                return Response({'error': 'no_container_id'}, status=500)

            # Step 2: Publish container
            publish_resp = requests.post(
                f'https://graph.facebook.com/v19.0/{ig_account_id}/media_publish',
                data={
                    'creation_id': container_id,
                    'access_token': access_token,
                },
                timeout=30,
            )
            if not publish_resp.ok:
                return Response({'error': 'publish_failed', 'detail': publish_resp.text}, status=publish_resp.status_code)

            media_id = publish_resp.json().get('id')
            return Response({'status': 'posted', 'media_id': media_id}, status=200)

        except Exception as e:
            return Response({'error': f'instagram_error: {str(e)}'}, status=500)
