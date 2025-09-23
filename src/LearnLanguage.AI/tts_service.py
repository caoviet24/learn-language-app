import torch
import scipy
import io
import os
import uuid
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan


class TextToSpeechService:
    def __init__(self):
        self.processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
        self.model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")
        self.vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")
        
        # Get project root directory and ensure audio directory exists
        self.project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.audio_dir = os.path.join(self.project_root, "audio")
        os.makedirs(self.audio_dir, exist_ok=True)
        
    def generate_speech(self, text: str) -> bytes:
        inputs = self.processor(text=text, return_tensors="pt")
        
        # Generate speaker embeddings
        speaker_embeddings = torch.zeros((1, 512))
        
        # Generate speech
        speech = self.model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=self.vocoder)
        
        # Convert to bytes
        buffer = io.BytesIO()
        sampling_rate = 16000
        scipy.io.wavfile.write(buffer, rate=sampling_rate, data=speech.numpy())
        buffer.seek(0)
        
        return buffer.read()
    
    def generate_speech_file(self, text: str) -> str:
        """
        Generate speech from text and save to a file
        
        Args:
            text (str): The text to convert to speech
            
        Returns:
            str: The URL path to the generated audio file
        """
        # Process the input text
        inputs = self.processor(text=text, return_tensors="pt")
        
        # Generate speaker embeddings
        speaker_embeddings = torch.zeros((1, 512))
        
        # Generate speech
        speech = self.model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=self.vocoder)
        
        # Generate a unique filename
        filename = f"{uuid.uuid4()}.wav"
        filepath = os.path.join(self.audio_dir, filename)
        
        # Save to file
        sampling_rate = 16000
        scipy.io.wavfile.write(filepath, rate=sampling_rate, data=speech.numpy())
        
        # Return just the path without the protocol
        return f"audio/{filename}"