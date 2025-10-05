import os
import requests
from typing import Optional
try:
    import argostranslate.package as argos_package  # type: ignore
    import argostranslate.translate as argos_translate  # type: ignore
except Exception:
    argos_package = None
    argos_translate = None

try:
    from google.cloud import translate_v2 as translate  # type: ignore
except Exception:
    translate = None


class CaptionTranslationService:
    def __init__(self):
        # Use Google client if available; otherwise remain None for offline mode
        self.client = translate.Client() if translate is not None else None
        self.libre_url = os.environ.get("LIBRETRANSLATE_URL", "https://libretranslate.de")
        # Default source language for captions
        self.default_source = os.environ.get("CAPTION_SOURCE_LANG", "en")

    # -------- Argos helpers --------
    def _argos_available(self) -> bool:
        return argos_package is not None and argos_translate is not None

    def _ensure_argos_model(self, from_code: str, to_code: str) -> bool:
        if not self._argos_available():
            return False
        try:
            installed = argos_package.get_installed_packages()
            for p in installed:
                if p.from_code == from_code and p.to_code == to_code:
                    return True
            # Download and install
            available = argos_package.get_available_packages()
            # Find exact match or best match
            pkg: Optional[object] = next((p for p in available if p.from_code == from_code and p.to_code == to_code), None)
            if pkg is None:
                return False
            download_path = pkg.download()
            argos_package.install_from_path(download_path)
            return True
        except Exception as e:
            print(f"Argos ensure model error: {e}")
            return False

    def translate_caption(self, caption: str, target_language: str) -> str:
        if not caption:
            return ""

        print(f"Translation service called with caption: '{caption}', target: '{target_language}'")
        print(f"Google client available: {self.client is not None}")
        print(f"GOOGLE_APPLICATION_CREDENTIALS: {os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')}")

        # Try Google Cloud first
        if self.client is not None:
            try:
                result = self.client.translate(
                    caption,
                    target_language=target_language
                )
                translated_text = result['translatedText']
                print(f"Google Translate success: {translated_text}")
                return translated_text
            except Exception as e:
                print(f"Error with Google Translate: {e}")
                import traceback
                traceback.print_exc()

        # Try Argos Translate (fully offline) if available; will auto-download model
        try:
            if self._argos_available() and self._ensure_argos_model(self.default_source, target_language):
                return argos_translate.translate(caption, self.default_source, target_language)
        except Exception as e:
            print(f"Error with Argos Translate: {e}")

        # Try LibreTranslate (no key required by default). Not offline but free.
        try:
            resp = requests.post(f"{self.libre_url}/translate", timeout=20, json={
                "q": caption,
                "source": "auto",
                "target": target_language,
                "format": "text"
            })
            if resp.ok:
                data = resp.json()
                if isinstance(data, dict) and data.get("translatedText"):
                    return data["translatedText"]
        except Exception as e:
            print(f"Error with LibreTranslate: {e}")

        # Try MyMemory as another free fallback (rate-limited). Requires explicit source language.
        try:
            # Assume source is English for most captions
            src = "en"
            tgt = target_language
            # Map common codes that differ across services
            if tgt == "zh":
                tgt = "zh-CN"
            url = (
                "https://api.mymemory.translated.net/get"
                f"?q={requests.utils.quote(caption)}&langpair={src}|{tgt}"
            )
            r = requests.get(url, timeout=20)
            if r.ok:
                js = r.json()
                if js.get("responseData", {}).get("translatedText"):
                    return js["responseData"]["translatedText"]
        except Exception as e:
            print(f"Error with MyMemory: {e}")

        # Offline fallback
        return f"[{target_language}] {caption}"
