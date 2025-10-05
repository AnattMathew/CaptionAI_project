from allauth.account.adapter import DefaultAccountAdapter
from allauth.account import app_settings as allauth_account_settings
from django.contrib.auth import get_user_model
import uuid

class CustomAccountAdapter(DefaultAccountAdapter):
    def clean_username(self, username, fallback_to_email=False):
        if not allauth_account_settings.USERNAME_REQUIRED:
            # Generate a unique dummy username if not required
            return "user_" + str(uuid.uuid4())
        return super().clean_username(username)

    def save_user(self, request, user, form, commit=True):
        # Custom logic to handle username if not required
        if not allauth_account_settings.USERNAME_REQUIRED:
            user.username = "user_" + str(uuid.uuid4()) # Assign a unique dummy username
        return super().save_user(request, user, form, commit=commit)

    # Override `is_email_available` to prevent username checks when username is optional
    def is_email_available(self, email):
        # By default, allauth might try to check username uniqueness even if email is primary
        # With `ACCOUNT_USERNAME_REQUIRED = False`, we ensure it only checks email uniqueness.
        if not allauth_account_settings.USERNAME_REQUIRED:
            return super().is_email_available(email) # Rely on allauth's email check
        return super().is_email_available(email)

    # Override `is_username_available` to always return True if username is not required
    def is_username_available(self, username):
        if not allauth_account_settings.USERNAME_REQUIRED:
            return True  # Always available if not required
        return super().is_username_available(username)
