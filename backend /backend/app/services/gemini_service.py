from google import genai
from app.config import GEMINI_API_KEY, MODEL_NAME

client = genai.Client(api_key=GEMINI_API_KEY)

def stream_chat(messages):
    response = client.models.generate_content_stream(
        model=MODEL_NAME,
        contents=messages
    )

    for chunk in response:
        if chunk.text:
            yield chunk.text