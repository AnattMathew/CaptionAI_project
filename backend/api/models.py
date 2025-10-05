from django.db import models

class ImageUpload(models.Model):
    image = models.ImageField(upload_to='uploads/')
    caption = models.TextField(blank=True)
    platform = models.CharField(max_length=50, blank=True)  # e.g., instagram
    formatted_image = models.ImageField(upload_to='formatted/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)