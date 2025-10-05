import openai
import os


class CaptionStylingService:
    def __init__(self):
        self.api_key = os.environ.get("OPENAI_API_KEY")
        self.client = openai.OpenAI(api_key=self.api_key) if self.api_key else None

    def _normalize_sentence(self, text: str) -> str:
        cleaned = text.strip().strip('"\'\u201c\u201d')
        if not cleaned:
            return cleaned
        while cleaned and cleaned[-1] in ".!?;:,":
            cleaned = cleaned[:-1]
        first = cleaned[0].upper()
        rest = cleaned[1:]
        return f"{first}{rest}."

    def _strip_common_wrappers(self, text: str) -> str:
        base = text.strip()
        lower = base.lower()
        prefixes = [
            "in summary,",
            "summary:",
            "in short,",
            "to sum up,",
        ]
        for p in prefixes:
            if lower.startswith(p):
                base = base[len(p):].lstrip()
                break
        # Avoid stacking previously added suffixes
        suffixes = [
            " — the camera clearly approved.",
            "— the camera clearly approved.",
            ", soft as evening light.",
            " — and yes, it’s totally Instagram-worthy!",
            "— and yes, it’s totally Instagram-worthy!",
        ]
        for s in suffixes:
            if base.endswith(s):
                base = base[: -len(s)].rstrip()
        return base

    def _local_style(self, caption: str, style: str) -> str:
        base = self._strip_common_wrappers(caption)
        if not base:
            return base

        style_lower = (style or "").lower()
        if style_lower == "formal":
            return self._normalize_sentence(base)

        if style_lower == "humorous":
            normalized = self._normalize_sentence(base)[:-1]
            return f"{normalized} — the camera clearly approved."

        if style_lower == "poetic":
            normalized = self._normalize_sentence(base)[:-1]
            return f"{normalized}, soft as evening light."

        return self._normalize_sentence(base)

    def style_caption(self, caption: str, style: str) -> str:
        if not self.client:
            return self._local_style(caption, style)

        try:
            response = self.client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo"),
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You rewrite image captions faithfully in the requested tone. "
                            "Keep all facts; do not invent details. "
                            "Return exactly one sentence under 25 words, no emojis/quotes/prefixes."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"Tone: {style}. Caption: {self._strip_common_wrappers(caption)}\nRewrite now.",
                    },
                ],
                max_tokens=60,
                temperature=0.7,
            )
            styled_caption = (response.choices[0].message.content or "").strip()
            if styled_caption:
                styled_caption = self._normalize_sentence(self._strip_common_wrappers(styled_caption))
            return styled_caption or self._local_style(caption, style)
        except Exception as e:
            print(f"Error styling caption with OpenAI: {e}")
            return self._local_style(caption, style)
