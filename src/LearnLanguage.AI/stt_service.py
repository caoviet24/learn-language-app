from faster_whisper import WhisperModel

# device: "cpu" hoặc "cuda"
model_size = "small"
model = WhisperModel(model_size, device="cpu", compute_type="int8_float16")

segments, info = model.transcribe("./audio/output.wav", beam_size=5, language="vi", task="transcribe")

print("Detected language:", info.language)
print("Transcription:")
for segment in segments:
    print(f"[{segment.start:.2f} - {segment.end:.2f}] {segment.text}")
