from django.db import models

# Create your models here.

class ImageUpload(models.Model):
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    caption = models.TextField(blank=True, null=True)
    caption_style = models.CharField(max_length=100, blank=True, null=True)
    translated_caption = models.TextField(blank=True, null=True)
    target_platform = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Image {self.id} uploaded at {self.uploaded_at.strftime('%Y-%m-%d %H:%M')}"