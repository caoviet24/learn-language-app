import json
from openai import OpenAI
import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
from tts_service import TextToSpeechService


load_dotenv()

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

def talkingService(message, language, topic):
    """
    Creates a bot that maintains conversation history and returns the message with audio.
    
    Args:
        message (str): The user's message
        language (str): The language to respond in
        topic (str): The topic of the conversation
    
    Returns:
        dict: JSON response containing the message and audio URL
    """
    # For this implementation, we'll maintain conversation history in memory
    # In a production environment, you'd want to store this in a database
    if not hasattr(talkingService, 'conversation_history'):
        talkingService.conversation_history = []
    
    # Add the user's message to the conversation history
    talkingService.conversation_history.append({"role": "user", "content": message})
    
    # Limit conversation history to last 10 exchanges to prevent context overflow
    if len(talkingService.conversation_history) > 10:
        talkingService.conversation_history = talkingService.conversation_history[-10:]
    
    # Prepare the prompt with conversation history
    conversation_text = "\n".join([f"{item['role'].capitalize()}: {item['content']}" for item in talkingService.conversation_history])
    
    prompt = f"""
    You are an AI that engages in conversations with users to help them practice {language}.
    You will respond in {language} and keep the conversation going naturally.
    Use simple vocabulary and sentence structures suitable for language learners.
    The conversation topic is: {topic}
    
    Conversation history:
    {conversation_text}
    
    Respond to the user's last message in the conversation above, keeping in mind the topic: {topic}
    """
    
    # Get AI response
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are a helpful assistant that speaks {language} and helps users practice {language}. Keep responses concise and helpful."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,
        temperature=0.7,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    
    ai_response = response.choices[0].message.content.strip()
    
    # Add the AI's response to the conversation history
    talkingService.conversation_history.append({"role": "assistant", "content": ai_response})
    
    # Generate audio for the AI response using TTS service
    tts_service = TextToSpeechService()
    audio_filename = tts_service.generate_speech_file(ai_response)

    print(f"Generated audio file: {audio_filename}")
    print(f"AI response: {ai_response}")

    # Return JSON response with message and audio
    return {
        "message": ai_response,
        "audio": audio_filename
    }

# while(True):
#     user_input = input("You: ")
#     if user_input.lower() in ['exit', 'quit']:
#         break
#     response = talkingService(user_input, "Vietnamese", "daily conversation")
#     print(f"Bot: {response['message']}")
#     # print(f"Audio file: {response['audio']}")
