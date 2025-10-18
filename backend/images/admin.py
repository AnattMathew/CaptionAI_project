from django.contrib import admin
from django.utils.html import format_html
from .models import ImageUpload

# Customize admin site headers
admin.site.site_header = "CaptionAI Administration"
admin.site.site_title = "CaptionAI Admin"
admin.site.index_title = "Welcome to CaptionAI Administration"

@admin.register(ImageUpload)
class ImageUploadAdmin(admin.ModelAdmin):
    list_display = ('id', 'image_preview', 'caption_preview', 'caption_style', 'translated_caption_preview', 'target_platform', 'uploaded_at')
    list_filter = ('caption_style', 'target_platform', 'uploaded_at')
    search_fields = ('caption', 'translated_caption')
    readonly_fields = ('uploaded_at', 'updated_at', 'image_preview')
    list_per_page = 25
    
    fieldsets = (
        ('Image Information', {
            'fields': ('image', 'image_preview', 'uploaded_at', 'updated_at')
        }),
        ('Caption Information', {
            'fields': ('caption', 'caption_style')
        }),
        ('Translation', {
            'fields': ('translated_caption',)
        }),
        ('Resizing', {
            'fields': ('target_platform',)
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px; max-width: 100px;" />', obj.image.url)
        return "No image"
    image_preview.short_description = "Preview"
    
    def caption_preview(self, obj):
        if obj.caption:
            return obj.caption[:50] + "..." if len(obj.caption) > 50 else obj.caption
        return "No caption"
    caption_preview.short_description = "Caption"
    
    def translated_caption_preview(self, obj):
        if obj.translated_caption:
            return obj.translated_caption[:50] + "..." if len(obj.translated_caption) > 50 else obj.translated_caption
        return "No translation"
    translated_caption_preview.short_description = "Translated Caption"
