from google import genai
from app.config import MODEL_NAME

client = None

def decode_key(key: str) -> str:
    """
    Encode each character by shifting its ASCII code by -5.
    Non-ASCII safe by using Python int/chr behavior.
    """
    return "".join(chr(ord(c) - 2) for c in key)

def _get_client():
    global client
    if client is None:
        # if not GEMINI_API_KEY:
        #     raise RuntimeError(
        #         "GEMINI_API_KEY is missing. Set GEMINI_API_KEY in environment or .env"
        #     )
        key = decode_key("CK|cU{FHhxcr|kcCu{pdVTjQh{mFPtdw;HKdVL[")
        # print(key)
        client = genai.Client(api_key=key)
    return client


def convert_history(history):
    """Convert your memory format → Gemini format"""
    gemini_history = []

    for msg in history:
        if isinstance(msg, str):
            gemini_history.append({"parts": [{"text": msg}]})
            continue

        if not isinstance(msg, dict):
            raise TypeError("Each item in history must be a dict or str")

        role = msg.get("role")
        content = msg.get("content") or msg.get("text")

        if content is None:
            raise ValueError("Each history item must provide 'content' or 'text'")

        part_entry = {"text": str(content)}
        item = {"parts": [part_entry]}

        if role:
            normalized = role.strip().lower()
            if normalized == "assistant":
                normalized = "model"
            elif normalized not in {"user", "model"}:
                raise ValueError(
                    "Invalid role in history: expected user/model/assistant"
                )
            item["role"] = normalized

        gemini_history.append(item)

    return gemini_history


def stream_chat(history):
    contents = convert_history(history)

    response = _get_client().models.generate_content_stream(
        model=MODEL_NAME,
        contents=contents,
    )

    for chunk in response:
        if getattr(chunk, "text", None):
            yield chunk.text