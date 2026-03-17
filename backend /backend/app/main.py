from fastapi import FastAPI
from app.routes import chat
from app.middleware.rate_limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

app = FastAPI()

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.include_router(chat.router)

@app.get("/")
def home():
    return {"message": "Gemini Chatbot Running 🚀"}