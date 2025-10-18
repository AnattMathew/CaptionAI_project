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
        import re
        
        base = text.strip()
        
        # Remove specific unwanted phrases with word boundaries
        unwanted_patterns = [
            r'\bin summary\b[.,:!?]*',
            r'\bsummary\b[.,:!?]*',
            r'\binstagram[- ]?worthy\b[.,:!?]*',
            r'\btotally worth sharing\b[.,:!?]*',
            r'\bworth sharing\b[.,:!?]*',
            r'\bcamera approved\b[.,:!?]*',
            r'\bcamera clearly approved\b[.,:!?]*',
            r'\bsoft as evening light\b[.,:!?]*',
            r'\bgolden hour\b[.,:!?]*',
            r'\bmoment that demands\b[.,:!?]*',
            r'\bunforgettable moment\b[.,:!?]*',
            r'\bdelightful moment\b[.,:!?]*',
            r'\bbeautiful scene\b[.,:!?]*',
            r'\bpretty cool\b[.,:!?]*',
            r'\bwhispers carried on a gentle breeze\b[.,:!?]*',
            r'\bwhispers carried\b[.,:!?]*',
            r'\bgentle breeze\b[.,:!?]*',
            r'\band yes, it\'s totally\b[.,:!?]*',
            r'\b— and yes, it\'s totally\b[.,:!?]*',
            r'\b— the camera\b[.,:!?]*',
            r'\b— a moment\b[.,:!?]*',
            r'\b— totally worth\b[.,:!?]*',
            r'\b— an unforgettable\b[.,:!?]*',
            r'\b— what a delightful\b[.,:!?]*',
            r'\b— captured in the golden\b[.,:!?]*',
            r'\b— the camera definitely\b[.,:!?]*',
            # Additional patterns for broken text
            r'\byes, it is totally\b[.,:!?]*',
            r'\b— yes, it is totally\b[.,:!?]*',
            r'\b— yes, it\'s totally\b[.,:!?]*',
            r'\byes, it\'s totally\b[.,:!?]*',
            r'\btotally like\b[.,:!?]*',
            r'\b— totally like\b[.,:!?]*',
            r'\blike\b[.,:!?]*$',  # Remove standalone "like" at the end
            r'\b— like\b[.,:!?]*',  # Remove "— like"
            r'\b- like\b[.,:!?]*',  # Remove "- like"
            r'\blike\b[.,:!?]*',   # Remove any standalone "like"
        ]
        
        # Apply each pattern
        for pattern in unwanted_patterns:
            base = re.sub(pattern, ' ', base, flags=re.IGNORECASE)
        
        # Clean up the result
        base = re.sub(r'\s+', ' ', base)  # Multiple spaces to single space
        base = re.sub(r'\s*[—\-]\s*$', '', base)  # Remove trailing dashes
        base = re.sub(r'\s*[,.]\s*$', '', base)   # Remove trailing punctuation
        base = re.sub(r'\s*[-]\s*$', '', base)    # Remove trailing hyphens
        base = base.strip()
        
        return base


    def _local_style(self, caption: str, style: str) -> str:
        # Clean the input caption first
        base = self._strip_common_wrappers(caption)
        if not base:
            return base

        style_lower = (style or "").lower()
        
        # Return original caption for normal style
        if style_lower == "normal":
            return self._normalize_sentence(base)

        if style_lower == "humorous":
            # Simple humorous addition
            normalized = self._normalize_sentence(base)[:-1]
            return f"{normalized} — quite amusing!"

        if style_lower == "poetic":
            # Enhanced poetic styling with multiple options
            normalized = self._normalize_sentence(base)[:-1]
            
            # Create different poetic variations
            poetic_endings = [
                ", a moment frozen in time.",
                ", where dreams meet reality.",
                ", painted by nature's brush.",
                ", a whisper of beauty.",
                ", captured in eternal grace."
            ]
            
            # Use a simple hash to consistently pick one ending based on caption content
            import hashlib
            caption_hash = int(hashlib.md5(normalized.encode()).hexdigest(), 16)
            selected_ending = poetic_endings[caption_hash % len(poetic_endings)]
            
            return f"{normalized}{selected_ending}"

        return self._normalize_sentence(base)

    def style_caption(self, caption: str, style: str) -> str:
        # For now, let's use only local styling to avoid AI issues
        return self._local_style(caption, style)
