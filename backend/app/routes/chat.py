from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.groq_service import ask_groq

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    if not payload.messages:
        raise HTTPException(status_code=400, detail="Message list cannot be empty.")
        
    try:
        # Convert Pydantic models to dict format expected by service
        msg_dicts = [{"role": msg.role, "content": msg.content} for msg in payload.messages]
        ai_reply = ask_groq(msg_dicts)
        return ChatResponse(response=ai_reply)
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
