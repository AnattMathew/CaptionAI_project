from django.urls import path
from .views import ImageUploadView, GenerateCaptionView, StyleCaptionView, TranslateCaptionView, ResizeImageView, InstagramShareView

urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='image-upload'),
    path('generate-caption/', GenerateCaptionView.as_view(), name='generate-caption'),
    path('style-caption/', StyleCaptionView.as_view(), name='style-caption'),
    path('translate-caption/', TranslateCaptionView.as_view(), name='translate-caption'),
    path('resize-image/', ResizeImageView.as_view(), name='resize-image'),
    path('share-instagram/', InstagramShareView.as_view(), name='share-instagram'),
]
