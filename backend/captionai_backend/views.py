from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET"])
def api_home(request):
    """
    API Home endpoint - provides information about the CaptionAI API
    """
    return JsonResponse({
        "message": "Welcome to CaptionAI API!",
        "version": "1.0.0",
        "description": "AI-powered image captioning and social media optimization",
        "endpoints": {
            "upload": "/api/upload/",
            "generate_caption": "/api/generate-caption/",
            "style_caption": "/api/style-caption/",
            "translate_caption": "/api/translate-caption/",
            "resize_image": "/api/resize-image/",
            "share_instagram": "/api/share-instagram/"
        },
        "status": "active",
        "documentation": "https://github.com/AnattMathew/CaptionAI_project"
    })

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Health check endpoint for monitoring
    """
    return JsonResponse({
        "status": "healthy",
        "service": "CaptionAI Backend",
        "version": "1.0.0"
    })
