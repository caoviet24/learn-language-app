import json
from openai import OpenAI
import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

clientHF = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HUGGINGFACE_API_KEY"),
)


def generate_question(word: str = None, qtype: str = None, topic: str = None, previous_question: str = None, language_in: str = "English", language_out: str = "Vietnamese"):
    prompt = f"""
    You are an AI that generates JSON objects for bilingual language learning quizzes.

    Rules:
    1. Always return pure JSON only, without markdown code blocks or explanations.
    2. JSON format must be:
    {{
      "topic": "<topic or null>",
      "word": "<chosen word or null>",
      "question_type": "<type>",
      "question": "<the question in {language_in}>",
      "answer": <string | array | object in {language_out}>,
      "options": <array | object in {language_out}>
    }}

    Requirements:
    - If `word` is provided → use that word.
    - If `word` is missing but `topic` is provided → choose a suitable word related to the topic.
    - If `topic` is provided → include it in the JSON. If not → set "topic": null.
    - `question_type` must exactly match the requested type.
    - The new question MUST NOT be identical or too similar to the previous question: "{previous_question if previous_question else "none"}".

    Question rules:
    - All questions MUST be in {language_in}.
    - All answers and options MUST be in {language_out}.

    Answer rules:
    - For `fill_in_blank`: answer is a single string in {language_out}.
    - For `translation`: answer is the translated text (6–8 words) from {language_in} → {language_out}.
    - For `multiple_choice`: answer is a single string in {language_out}.
    - For `match`: answer is an array of objects, each {language_in} → {language_out}.
      Example: [{{"home": "nhà"}}, {{"apartment": "căn hộ"}}, {{"building": "tòa nhà"}}]

    Options rules:
    - For `multiple_choice` and `fill_in_blank`: exactly 4 options in {language_out}.
      * 1 correct (same as answer).
      * 3 incorrect/unrelated words (not synonyms or translations of the correct one).
    - For `match`:
      {{
        "{language_in}": ["word1", "word2", "word3", "word4"],
        "{language_out}": ["nghĩa1", "nghĩa2", "nghĩa3", "nghĩa4"]
      }}
    - For `translation`: options = [].

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
