# LearnLanguage.AI

This directory contains the AI components for the LearnLanguage application, including text generation and text-to-speech functionalities.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Environment Variables:
   The application uses environment variables for API keys. Create a `.env` file in this directory with the following variables:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```
   
   For development, you can use the example values from the `.env` file in this directory.

## Running the Application

To run the Flask API server:
```bash
python openai_client.py
```

The server will start on `http://localhost:5000`.

## API Endpoints

- POST `/generate` - Generate language learning questions
- POST `/compare` - Compare sentence similarity
- POST `/text-to-speech` - Convert text to speech and return URL to audio file

## Components

- `openai_client.py` - Flask API server with OpenAI/OpenRouter integration
- `text-to-speech.py` - Text-to-speech functionality using Hugging Face models
- `.env` - Environment variables (example file)
- `requirements.txt` - Python package dependencies