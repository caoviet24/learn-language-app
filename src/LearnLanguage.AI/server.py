import json
from flask import Flask, request, jsonify, send_file
from openai import OpenAI
import os
from huggingface_hub import InferenceClient
from flask_cors import CORS
from dotenv import load_dotenv
import io
from tts_service import TextToSpeechService

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

clientHF = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HUGGINGFACE_API_KEY"),
)

# Initialize text-to-speech service
tts_service = TextToSpeechService()


def generate_question(word: str = None, qtype: str = None, topic: str = None, previous_question: str = None):
    prompt = f"""
    You are an AI that generates JSON objects for language learning quizzes.

    Rules:
    1. Always return pure JSON only, without markdown code blocks or explanations.
    2. JSON format must be:
    {{
      "topic": "<topic or null>",
      "word": "<chosen word or null>",
      "question_type": "<type>",
      "question": "<the question in English>",
      "answer": <string | array | object>,
      "options": <array | object>
    }}

    Requirements:
    - If `word` is provided → use that word.
    - If `word` is missing but `topic` is provided → choose a suitable word related to the topic.
    - If `topic` is provided → include it in the JSON. If not → set "topic": null.
    - `question_type` must exactly match the requested type.
    - The new question MUST NOT be identical or too similar to the previous question: "{previous_question if previous_question else "none"}".

    Answer rules:
    - For `fill_in_blank`: a single string answer.
    - For `translation`: the translated text, with length about 6–8 words.
    - For `multiple_choice`: a single string answer.
    - For `match`: an array of objects, each object is one English → Vietnamese pair.
      Example: [{{"home": "nhà"}}, {{"apartment": "căn hộ"}}, {{"building": "tòa nhà"}}]

    Options rules:
    - For `multiple_choice` and `fill_in_blank`: exactly 4 options.
      * 1 correct (same as answer).
      * 3 incorrect/unrelated words (not synonyms or translations of the correct one).
    - For `match`:
      {{
        "english": ["word1", "word2", "word3", "word4"],
        "vietnamese": ["nghĩa1", "nghĩa2", "nghĩa3", "nghĩa4"]
      }}
    - For `translation`: empty array [].

    Now generate one quiz with:
    - Word: {word if word else "choose one from topic"}
    - Topic: {topic if topic else "null"}
    - Question type: {qtype}
    """


    try:
        completion = client.chat.completions.create(
          model="x-ai/grok-4-fast:free",
          messages=[
            {
              "role": "user",
              "content": prompt
            }
          ]
        )
        
        text = completion.choices[0].message.content.strip()

        if text.startswith("```"):
            text = text.strip("`").replace("json\n", "").replace("json", "")

        try:
            return json.loads(text)
        except Exception as e:
            return {"raw": text, "error": str(e)}
    except Exception as e:
        return {"error": str(e)}

def compare_sentences(sentence1, sentence2):
    result = clientHF.sentence_similarity(
        sentence=sentence1,
        other_sentences=[sentence2],
        model="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    return result[0]

  

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    word = data.get("word")
    qtype = data.get("question_type")
    topic = data.get("topic")

    if not word and not topic:
        return jsonify({"error": "Missing 'word' or 'topic'"}), 400
    if not qtype:
        return jsonify({"error": "Missing 'question_type'"}), 400

    try:
        result = generate_question(word=word, qtype=qtype, topic=topic)
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
        # Use absolute path relative to the project root
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        audio_path = os.path.join(project_root, "audio", filename)
        
        if os.path.exists(audio_path):
            return send_file(audio_path, mimetype="audio/wav")
        else:
            return jsonify({"error": f"Audio file not found at {audio_path}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)