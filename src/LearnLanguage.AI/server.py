import json
from flask import Flask, request, jsonify, send_file
from openai import OpenAI
import os
from huggingface_hub import InferenceClient
from flask_cors import CORS
from dotenv import load_dotenv
import io
from tts_service import TextToSpeechService
from stt_service import transcribe_audio
from question_generator import generate_question
from translation_service import translate_word
from talking_service import talkingService

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)


clientHF = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HUGGINGFACE_API_KEY"),
)

# Initialize text-to-speech service
tts_service = TextToSpeechService()



def compare_sentences(sentence1, sentence2):
    result = clientHF.sentence_similarity(
        sentence=sentence1,
        other_sentences=[sentence2],
        model="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    return result[0]


@app.route("/generate-question", methods=["POST"])
def generate_question_api():
    data = request.get_json()
    word = data.get("word")
    question_type = data.get("question_type")  # Changed from qtype to match what's sent in request
    topic = data.get("topic")
    previous_question = data.get("previous_question")
    language_in = data.get("language_in", "English")
    language_out = data.get("language_out", "Vietnamese")

    if not word and not topic:
        return jsonify({"error": "Missing 'word' or 'topic'"}), 400
    if not question_type:
        return jsonify({"error": "Missing 'question_type'"}), 400

    try:
        result = generate_question(word=word, qtype=question_type, topic=topic, previous_question=previous_question, language_in=language_in, language_out=language_out)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
      
@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json()
    sentence1 = data.get("sentence1")
    sentence2 = data.get("sentence2")

    if not sentence1 or not sentence2:
        return jsonify({"error": "Missing 'sentence1' or 'sentence2'"}), 400

    try:
        score = compare_sentences(sentence1, sentence2)
        return jsonify({"similarity_score": score})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    data = request.get_json()
    text = data.get("text")
    
    if not text:
        return jsonify({"error": "Missing 'text'"}), 400
    
    try:
        # Generate audio file using TTS service
        audio_filename = tts_service.generate_speech_file(text)
        
        # Verify that the audio file was created successfully
        import os
        ai_dir = os.path.dirname(os.path.abspath(__file__))
        audio_path = os.path.join(ai_dir, audio_filename)
        
        if not os.path.exists(audio_path):
            return jsonify({"error": "Failed to generate audio file"}), 500
        
        # Get the base URL of the current request
        base_url = request.url_root.rstrip('/')
        
        # Return full URL with protocol that clients can access
        audio_url = f"{base_url}/{audio_filename}"
        
        return jsonify({"audio": audio_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/audio/<filename>")
def serve_audio(filename):
    """Serve audio files from the audio directory"""
    try:
        # Validate filename to prevent directory traversal attacks
        import os.path
        if '..' in filename or filename.startswith('/'):
            return jsonify({"error": "Invalid filename"}), 400
        
        # Use absolute path relative to the AI directory
        ai_dir = os.path.dirname(os.path.abspath(__file__))
        audio_path = os.path.join(ai_dir, "audio", filename)
        
        # Check if file exists and is within the audio directory
        if os.path.exists(audio_path) and os.path.isfile(audio_path):
            # Ensure the resolved path is within the audio directory
            if os.path.commonpath([ai_dir, audio_path]) == ai_dir:
                return send_file(audio_path, mimetype="audio/wav")
            else:
                return jsonify({"error": "Invalid file path"}), 400
        else:
            return jsonify({"error": f"Audio file not found: {filename}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/speech-to-text", methods=["POST"])
def speech_to_text():
    try:
        # Check if request contains multipart form data (file upload)
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            # Handle direct file upload
            if 'audio' not in request.files:
                return jsonify({"error": "No audio file provided in multipart request"}), 400
            
            audio_file = request.files['audio']
            
            if audio_file.filename == '':
                return jsonify({"error": "No audio file selected"}), 400
            
            # Save the uploaded audio file temporarily
            import tempfile
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
            audio_file.save(temp_file.name)
            
            # Get language from form data
            language = request.form.get('language', 'en')
            
            # Perform transcription
            segments, info = transcribe_audio(audio_path=temp_file.name, language=language)
            
            # Clean up the temporary file
            os.unlink(temp_file.name)
            
        else:
            # Handle JSON request with audio data
            data = request.get_json()
            if not data:
                return jsonify({"error": "No JSON data provided"}), 400
            
            # Handle base64 encoded audio data
            if 'audio_data' in data:
                audio_data = data['audio_data']
                language = data.get('language', 'en')
                
                # Check if this is base64 encoded audio
                if audio_data.startswith('data:'):
                    import base64
                    import tempfile
                    
                    # Extract audio format and data
                    header, encoded = audio_data.split(',', 1)
                    
                    # Decode base64 data
                    decoded_audio = base64.b64decode(encoded)
                    
                    # Save to temporary file
                    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
                    temp_file.write(decoded_audio)
                    temp_file.close()
                    
                    # Perform transcription
                    segments, info = transcribe_audio(audio_path=temp_file.name, language=language)
                    
                    # Clean up the temporary file
                    os.unlink(temp_file.name)
                else:
                    return jsonify({"error": "Invalid audio data format. Expected base64 encoded data."}), 400
                    
            # Handle audio URL (but not blob URLs)
            elif 'audio_url' in data:
                audio_url = data['audio_url']
                language = data.get('language', 'en')
                
                # Check if this is a blob URL (client-side URL that can't be accessed by server)
                if audio_url.startswith('blob:'):
                    return jsonify({
                        "error": "Blob URLs cannot be processed by the server. Please convert the audio to base64 or upload as a file.",
                        "suggestion": "Use 'audio_data' field with base64 encoded audio instead of 'audio_url' with blob URLs."
                    }), 400
                
                # Handle regular URLs
                segments, info = transcribe_audio(audio_path=audio_url, language=language)
            else:
                return jsonify({"error": "No audio provided. Use 'audio_data' for base64 audio or 'audio_url' for direct URLs, or upload as multipart form data."}), 400
        
        # Collect transcription results
        transcription = []
        full_text = ""
        
        for segment in segments:
            segment_data = {
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip()
            }
            transcription.append(segment_data)
            full_text += segment.text.strip() + " "
        
        return jsonify({
            "language": info.language,
            "transcription": transcription,
            "full_text": full_text.strip(),
            "success": True
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

LANGUAGE_CODE_MAP = {
    "en": "English",
    "vi": "Vietnamese",
    "fr": "French",
    "es": "Spanish",
    "de": "German",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ru": "Russian",
    "ar": "Arabic",
    "hi": "Hindi",
    "pt": "Portuguese",
    "nl": "Dutch",
    "tr": "Turkish",
    "pl": "Polish",
    "sv": "Swedish",
    "da": "Danish",
    "fi": "Finnish",
    "no": "Norwegian"
}

def get_full_language_name(lang_code):
    """Convert language code to full language name for T5 model"""
    return LANGUAGE_CODE_MAP.get(lang_code.lower(), lang_code)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    word = data.get("word")
    src_lang_code = data.get("src_lang", "en")
    tgt_lang_code = data.get("tgt_lang", "vi")

    if not word:
        return jsonify({"error": "Missing 'word'"}), 400

    try:
        # Convert language codes to full names for T5 model
        src_lang = get_full_language_name(src_lang_code)
        tgt_lang = get_full_language_name(tgt_lang_code)
        
        translation = translate_word(word, src_lang, tgt_lang)
        return jsonify({"translation": translation, "src_lang": src_lang, "tgt_lang": tgt_lang})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/talking-service", methods=["POST"])
def talking_service_api():
    """
    API endpoint for the talking service that returns message with audio.
    """
    data = request.get_json()
    message = data.get("message")
    language = data.get("language")
    topic = data.get("topic")
    
    if not message or not language or not topic:
        return jsonify({"error": "Missing 'message', 'language', or 'topic'"}), 400
    
    try:
        # Call the talking service
        result = talkingService(message, language, topic)
        
        # Get the base URL of the current request
        base_url = request.url_root.rstrip('/')
        
        # Return full URL with protocol that clients can access
        audio_url = f"{base_url}/{result['audio']}"
        
        return jsonify({
            "message": result["message"],
            "audio": audio_url
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)