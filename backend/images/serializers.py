from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from allauth.account import app_settings as allauth_account_settings
from .models import ImageUpload

class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(
        # Removed max_length and min_length to prevent TypeError with NoneType
        required=False,
        allow_blank=True,
    )

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        if not allauth_account_settings.USERNAME_REQUIRED:
            data['username'] = ''  # Ensure username is empty if not required
        return data


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageUpload
        fields = '__all__'
        read_only_fields = ('caption', 'translated_caption')
