from django.db import models

# Create your models here.

class ImageUpload(models.Model):
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    caption = models.TextField(blank=True, null=True)
    original_caption = models.TextField(blank=True, null=True)  # Store original caption
    caption_style = models.CharField(max_length=100, blank=True, null=True)
    translated_caption = models.TextField(blank=True, null=True)
    target_platform = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Image Upload"
        verbose_name_plural = "Image Uploads"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"Image {self.id} uploaded at {self.uploaded_at.strftime('%Y-%m-%d %H:%M')}"