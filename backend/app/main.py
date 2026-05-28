import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database.db import init_db
from app.routes.predict import router as predict_router
from app.routes.chat import router as chat_router
from app.routes.history import router as history_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Clinical Decision Support System (CDSS) API",
    description="A lightweight clinical API for symptom extraction, disease prediction, risk assessment, and chatbot helper.",
    version="1.0.0"
)

# Configure CORS so the React client running on port 5173 can access these routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting AI CDSS Backend...")
    # Initialize SQLite database and seed records
    init_db()

@app.get("/health")
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "AI Clinical CDSS API"}

# Include routes
app.include_router(predict_router, prefix="/api", tags=["Prediction"])
app.include_router(chat_router, prefix="/api", tags=["Chatbot"])
app.include_router(history_router, prefix="/api/history", tags=["History"])

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
