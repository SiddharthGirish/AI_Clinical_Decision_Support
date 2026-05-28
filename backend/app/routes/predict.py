from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.nlp_service import extract_symptoms
from app.services.ml_service import predict_disease
from app.services.risk_service import evaluate_risk
from app.database.db import save_prediction

router = APIRouter()

class PredictRequest(BaseModel):
    symptom_text: str

class PredictResponse(BaseModel):
    predicted_disease: str
    confidence: float
    risk_level: str
    symptoms_detected: list
    nlp_severity: str
    recommendations: list

@router.post("/predict", response_model=PredictResponse)
async def predict(payload: PredictRequest):
    text = payload.symptom_text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Symptom text cannot be empty.")
        
    try:
        # 1. NLP parsing to extract symptom tags and severity
        nlp_result = extract_symptoms(text)
        detected_symptoms = nlp_result["symptoms"]
        severity = nlp_result["severity"]
        
        # 2. ML model prediction
        disease, confidence = predict_disease(detected_symptoms)
        
        # 3. Risk level and recommendation determination
        risk_level, recommendations = evaluate_risk(disease, detected_symptoms, severity)
        
        # 4. Save to SQLite database
        save_prediction(
            predicted_disease=disease,
            confidence=confidence,
            risk_level=risk_level,
            symptoms_detected=detected_symptoms,
            recommendations=recommendations
        )
        
        return PredictResponse(
            predicted_disease=disease,
            confidence=confidence,
            risk_level=risk_level,
            symptoms_detected=detected_symptoms,
            nlp_severity=severity,
            recommendations=recommendations
        )
    except Exception as e:
        print(f"Error processing prediction request: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
