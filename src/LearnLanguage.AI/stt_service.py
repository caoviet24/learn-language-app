import os
import tempfile
import requests
from urllib.parse import urlparse
from faster_whisper import WhisperModel

def is_url(path):
    """
    Check if the given path is a URL
    
    Args:
        path (str): Path to check
    
    Returns:
        bool: True if path is a URL, False otherwise
    """
    try:
        result = urlparse(path)
        return all([result.scheme, result.netloc])
    except Exception:
        return False

def download_audio_from_url(url, temp_dir=None):
    """
    Download audio file from URL to a temporary location
    
    Args:
        url (str): URL of the audio file to download
        temp_dir (str, optional): Directory for temporary file storage
    
    Returns:
        str: Path to the downloaded temporary file
    
    Raises:
        requests.RequestException: If download fails
        ValueError: If URL is invalid or points to blob URL
    """
    if url.startswith('blob:'):
        raise ValueError("Blob URLs cannot be downloaded by server. Use base64 audio data instead.")
    
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        # Create a temporary file with the appropriate extension
        parsed_url = urlparse(url)
        file_extension = os.path.splitext(parsed_url.path)[1] or '.wav'
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_extension, dir=temp_dir)
        temp_file.write(response.content)
        temp_file.close()
        
        return temp_file.name
        
    except requests.RequestException as e:
        raise requests.RequestException(f"Failed to download audio from URL: {str(e)}")

def transcribe_audio(audio_path="./audio/output.wav", model_size="small", language="en"):
    """
    Transcribe audio file using faster_whisper
    
    Args:
        audio_path (str): Path or URL to the audio file to transcribe
        model_size (str): Size of the Whisper model to use (tiny, base, small, medium, large)
        language (str): Language code for transcription (e.g., 'en', 'vi', 'ja')
    
    Returns:
        tuple: (segments, info) from the transcription
    
    Raises:
        FileNotFoundError: If local audio file doesn't exist
        ValueError: If blob URL is provided
        Exception: If transcription fails
    """
    temp_file_path = None
    
    try:
        # Validate language parameter
        valid_languages = ['en', 'vi', 'ja', 'zh', 'ko', 'fr', 'de', 'es', 'pt', 'it', 'ru', 'ar']
        if language not in valid_languages:
            print(f"Warning: Language '{language}' may not be supported. Using 'auto' detection.")
            language = None  # Let Whisper auto-detect
        
        # Check if audio_path is a URL
        if is_url(audio_path):
            # Download the audio file from URL to a temporary location
            temp_file_path = download_audio_from_url(audio_path)
            file_path = temp_file_path
        else:
            # It's a local file path, check if it exists
            if not os.path.exists(audio_path):
                raise FileNotFoundError(f"Audio file not found: {audio_path}")
            file_path = audio_path
        
        # Validate model size
        valid_models = ["tiny", "base", "small", "medium", "large", "large-v2", "large-v3"]
        if model_size not in valid_models:
            print(f"Warning: Model size '{model_size}' not recognized. Using 'small'.")
            model_size = "small"
        
        # Initialize Whisper model (using CPU for better compatibility)
        model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        # Perform transcription with optimized parameters
        segments, info = model.transcribe(
            file_path,
            beam_size=5,
            language=language,
            task="transcribe",
            vad_filter=True,  # Voice activity detection
            vad_parameters=dict(min_silence_duration_ms=500)
        )
        
        return segments, info
        
    except ValueError as e:
        raise ValueError(f"Transcription error: {str(e)}")
    except Exception as e:
        raise Exception(f"Failed to transcribe audio: {str(e)}")
    finally:
        # Clean up temporary file if it was created
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as cleanup_error:
                print(f"Warning: Failed to clean up temporary file {temp_file_path}: {cleanup_error}")

if __name__ == "__main__":
    try:
        segments, info = transcribe_audio()
        
        print("Detected language:", info.language)
        print("Transcription:")
        for segment in segments:
            print(f"[{segment.start:.2f} - {segment.end:.2f}] {segment.text}")
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Make sure the audio file exists at the specified path.")
    except Exception as e:
        print(f"An error occurred: {e}")
