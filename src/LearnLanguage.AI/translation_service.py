from transformers import MarianMTModel, MarianTokenizer
from functools import lru_cache
import re

LANGUAGE_CODE_MAP = {
    "English": "en",
    "Vietnamese": "vi",
    "French": "fr",
    "Spanish": "es",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt",
    "Dutch": "nl",
    "Russian": "ru",
    "Chinese": "zh",
    "Japanese": "ja",
    "Korean": "ko",
    "Arabic": "ar",
    "Hindi": "hi",
    "Thai": "th",
    "Indonesian": "id",
    "Malay": "ms",
    "Turkish": "tr",
    "Polish": "pl",
    "Czech": "cs",
    "Swedish": "sv",
    "Finnish": "fi",
    "Danish": "da",
    "Norwegian": "no"
}

# Reverse mapping for language codes to names
REVERSE_LANGUAGE_CODE_MAP = {v: k for k, v in LANGUAGE_CODE_MAP.items()}

@lru_cache(maxsize=128)
def get_tokenizer_and_model(src_lang_code, tgt_lang_code):
    """
    Load the MarianMT model and tokenizer for specific language pair.
    MarianMT models are specifically designed for translation tasks.
    """
    model_name = f"Helsinki-NLP/opus-mt-{src_lang_code}-{tgt_lang_code}"
    try:
        tokenizer = MarianTokenizer.from_pretrained(model_name)
        model = MarianMTModel.from_pretrained(model_name)
        return tokenizer, model
    except Exception as e:
        # If specific model doesn't exist, try a multilingual model
        try:
            model_name = f"Helsinki-NLP/opus-mt-{src_lang_code}-mul"
            tokenizer = MarianTokenizer.from_pretrained(model_name)
            model = MarianMTModel.from_pretrained(model_name)
            return tokenizer, model
        except Exception:
            # If that fails, try the reverse direction
            try:
                model_name = f"Helsinki-NLP/opus-mt-{tgt_lang_code}-{src_lang_code}"
                tokenizer = MarianTokenizer.from_pretrained(model_name)
                model = MarianMTModel.from_pretrained(model_name)
                return tokenizer, model
            except Exception:
                raise Exception(f"No suitable translation model found for {src_lang_code} to {tgt_lang_code}")

def translate_word(word, src_lang, tgt_lang):
    """
    Translate a word from source language to target language using MarianMT model.
    """
    try:
        # Convert language names to codes
        src_lang_code = LANGUAGE_CODE_MAP.get(src_lang, src_lang.lower())
        tgt_lang_code = LANGUAGE_CODE_MAP.get(tgt_lang, tgt_lang.lower())
        
        # Special case: if source and target languages are the same, return the word as is
        if src_lang_code == tgt_lang_code:
            return word
        
        # Handle special case where model might not exist for specific language pair
        # Try to find the best model available
        try:
            tokenizer, model = get_tokenizer_and_model(src_lang_code, tgt_lang_code)
        except Exception:
            # If the specific pair doesn't exist, try using a multilingual model
            # or a common language as bridge (like English)
            if src_lang_code != 'en' and tgt_lang_code != 'en':
                # Try via English as bridge
                tokenizer, model = get_tokenizer_and_model(src_lang_code, 'en')
                # First translate to English
                inputs = tokenizer(word, return_tensors="pt", padding=True)
                translated = model.generate(**inputs, max_length=20, num_beams=4)
                intermediate_text = tokenizer.decode(translated[0], skip_special_tokens=True)
                
                # Then translate from English to target
                tokenizer2, model2 = get_tokenizer_and_model('en', tgt_lang_code)
                inputs2 = tokenizer2(intermediate_text, return_tensors="pt", padding=True)
                translated2 = model2.generate(**inputs2, max_length=20, num_beams=4)
                tgt_text = tokenizer2.decode(translated2[0], skip_special_tokens=True)
                return tgt_text
            else:
                raise Exception(f"No translation model available for {src_lang_code} to {tgt_lang_code}")
        
        # Tokenize the input
        inputs = tokenizer(word, return_tensors="pt", padding=True)
        
        # Generate translation
        translated = model.generate(**inputs, max_length=20, num_beams=4)
        
        # Decode the result
        tgt_text = tokenizer.decode(translated[0], skip_special_tokens=True)
        return tgt_text
    except Exception as e:
        print(f"Error translating '{word}' from {src_lang} to {tgt_lang}: {str(e)}")
        raise e

# Example: Translate the word "dog" from English to Vietnamese
if __name__ == "__main__":
    print(translate_word("dog", "English", "Vietnamese"))
