import re
import spacy

# Known symptom vocabulary with mapping synonyms to standardized features
SYMPTOM_MAP = {
    "fever": ["fever", "fevers", "feverish", "high temperature", "chills", "sweats"],
    "cough": ["cough", "coughing", "coughs", "tussis", "cough dry", "cough wet"],
    "shortness_of_breath": ["shortness of breath", "breathing difficulty", "difficulty breathing", "breathless", "short of breath", "hard to breathe"],
    "chest_pain": ["chest pain", "chest tightness", "pain in chest", "chest ache", "chest pressure"],
    "headache": ["headache", "headaches", "head pain", "migraine", "throbbing head"],
    "sore_throat": ["sore throat", "throat irritation", "painful swallowing", "itchy throat", "throat pain"],
    "fatigue": ["fatigue", "tired", "exhausted", "weakness", "lethargy", "sleepy", "drowsy", "tiredness"],
    "body_ache": ["body ache", "body aches", "muscle pain", "muscle ache", "muscle aches", "myalgia", "body pain", "joint pain"],
    "loss_of_taste_smell": ["loss of taste", "loss of smell", "cannot smell", "cannot taste", "no taste", "no smell", "taste loss", "smell loss", "anosmia", "ageusia"],
    "runny_nose": ["runny nose", "stuffy nose", "nasal congestion", "congestion", "sneezing", "blocked nose", "rhinorrhea"]
}

# Severity indicator words
SEVERITY_KEYWORDS = {
    "high": ["severe", "extremely", "intense", "worse", "critical", "very bad", "terrible", "unbearable", "high"],
    "moderate": ["moderate", "mildly", "somewhat", "bothering", "medium", "noticeable"],
    "low": ["mild", "slight", "slightly", "a bit", "little"]
}

# Load spaCy model gracefully
nlp = None
try:
    nlp = spacy.load("en_core_web_sm")
    print("spaCy model 'en_core_web_sm' loaded successfully.")
except OSError:
    print("spaCy model 'en_core_web_sm' not found. Attempting to download...")
    try:
        import subprocess
        import sys
        subprocess.run([sys.executable, "-m", "spacy", "download", "en_core_web_sm"], check=True)
        nlp = spacy.load("en_core_web_sm")
        print("spaCy model downloaded and loaded successfully.")
    except Exception as e:
        print(f"Failed to download spaCy model: {e}. Falling back to rule-based keyword extraction.")
        nlp = None

def extract_symptoms(text: str):
    """
    Analyzes natural language input text to extract:
    1. List of detected symptoms (standardized to features).
    2. Overall severity detection (low, moderate, high).
    """
    text_lower = text.lower().strip()
    detected_symptoms = []
    
    # 1. Symptom Extraction
    # If spaCy is loaded, we can use it for lemmatization and processing, but rule-based mapping is very precise for our small vocabulary.
    if nlp:
        doc = nlp(text_lower)
        # Gather token lemmas
        lemmas = [token.lemma_ for token in doc]
        text_lemmatized = " ".join(lemmas)
        
        for symptom, synonyms in SYMPTOM_MAP.items():
            found = False
            # Check original text
            for synonym in synonyms:
                if synonym in text_lower:
                    found = True
                    break
            # Check lemmatized text
            if not found:
                for synonym in synonyms:
                    if synonym in text_lemmatized:
                        found = True
                        break
            if found:
                detected_symptoms.append(symptom)
    else:
        # Fallback keyword matching
        for symptom, synonyms in SYMPTOM_MAP.items():
            for synonym in synonyms:
                if synonym in text_lower:
                    detected_symptoms.append(symptom)
                    break

    # Remove duplicates while preserving order
    detected_symptoms = list(dict.fromkeys(detected_symptoms))

    # 2. Severity Detection
    severity = "low" # Default
    
    # Search for severity indicators in text
    has_high = any(word in text_lower for word in SEVERITY_KEYWORDS["high"])
    has_mod = any(word in text_lower for word in SEVERITY_KEYWORDS["moderate"])
    has_low = any(word in text_lower for word in SEVERITY_KEYWORDS["low"])
    
    if has_high:
        severity = "high"
    elif has_mod:
        severity = "moderate"
    elif has_low:
        severity = "low"
    else:
        # If no indicators are present, check if critical symptoms are present
        critical_symptoms = ["shortness_of_breath", "chest_pain"]
        if any(cs in detected_symptoms for cs in critical_symptoms):
            severity = "moderate" # Upgrade default severity for critical symptoms

    return {
        "symptoms": detected_symptoms,
        "severity": severity
    }
