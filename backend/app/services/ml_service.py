import os
import pickle
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "disease_model.pkl")

# Standard list of features/symptoms in correct order
FEATURES = [
    "fever",
    "cough",
    "shortness_of_breath",
    "chest_pain",
    "headache",
    "sore_throat",
    "fatigue",
    "body_ache",
    "loss_of_taste_smell",
    "runny_nose"
]

DISEASES = ["Flu", "COVID-19", "Pneumonia", "Migraine", "Viral Infection"]

# Fallback heuristic mapping for scoring if model load fails
HEURISTIC_SYMPTOMS = {
    "COVID-19": ["fever", "cough", "shortness_of_breath", "loss_of_taste_smell", "fatigue", "body_ache"],
    "Flu": ["fever", "cough", "body_ache", "runny_nose", "sore_throat", "fatigue"],
    "Pneumonia": ["fever", "cough", "shortness_of_breath", "chest_pain", "fatigue"],
    "Migraine": ["headache", "fatigue"],
    "Viral Infection": ["fever", "sore_throat", "runny_nose", "fatigue", "cough"]
}

_model_data = None

def load_model():
    """
    Attempts to load the serialized RandomForest classifier.
    If the file does not exist, triggers training automatically.
    """
    global _model_data
    if not os.path.exists(MODEL_PATH):
        print(f"Model file not found at {MODEL_PATH}. Attempting to train model...")
        try:
            from app.training.train_model import train as run_training
            run_training()
        except Exception as e:
            print(f"Auto-training failed: {e}")
            
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                _model_data = pickle.load(f)
            print("Successfully loaded ML model from pickle.")
        except Exception as e:
            print(f"Error loading model pickle: {e}")
            _model_data = None
    else:
        print("Warning: Model pickle is missing. Fallback classifier will be used.")

# Initial load attempt on import
load_model()

def fallback_predict(symptoms_list):
    """
    Fallback classifier using simple overlap heuristic scoring.
    """
    if not symptoms_list:
        return "Viral Infection", 50.0  # Default prediction for empty inputs
        
    scores = {}
    for disease, syms in HEURISTIC_SYMPTOMS.items():
        overlap = set(symptoms_list).intersection(set(syms))
        # Weight critical symptoms slightly higher
        score = sum(2 if s in ["shortness_of_breath", "chest_pain"] else 1 for s in overlap)
        scores[disease] = score
        
    best_disease = max(scores, key=scores.get)
    max_score = scores[best_disease]
    
    # Calculate confidence based on matched symptoms / total typical symptoms
    if max_score == 0:
        return "Viral Infection", 50.0
        
    total_typical = len(HEURISTIC_SYMPTOMS[best_disease])
    confidence = min(85.0, (max_score / total_typical) * 100)
    # Add a baseline confidence
    confidence = max(50.0, confidence + 20.0)
    return best_disease, round(confidence, 1)

def predict_disease(symptoms_list):
    """
    Predicts the disease based on detected symptoms list.
    Returns: (predicted_disease, confidence_score)
    """
    global _model_data
    
    # Ensure model is loaded if not already
    if _model_data is None:
        load_model()
        
    # If still None, use fallback
    if _model_data is None:
        return fallback_predict(symptoms_list)
        
    try:
        clf = _model_data["model"]
        features = _model_data["features"]
        
        # Build the model input feature vector
        vector = [1 if feature in symptoms_list else 0 for feature in features]
        vector = np.array(vector).reshape(1, -1)
        
        # Predict class probabilities
        probabilities = clf.predict_proba(vector)[0]
        classes = clf.classes_
        
        # Find maximum probability
        max_idx = np.argmax(probabilities)
        predicted_disease = classes[max_idx]
        confidence = probabilities[max_idx] * 100
        
        # If no symptoms are input, confidence should be low or default to a baseline
        if not symptoms_list:
            return "Viral Infection", 40.0
            
        return str(predicted_disease), round(float(confidence), 1)
    except Exception as e:
        print(f"Error during ML prediction: {e}. Falling back to heuristic classifier.")
        return fallback_predict(symptoms_list)
