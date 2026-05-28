import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Define symptoms (features)
SYMPTOMS = [
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

# Define target diseases
DISEASES = ["Flu", "COVID-19", "Pneumonia", "Migraine", "Viral Infection"]

# Probability mapping for symptoms given a disease (typical symptoms)
# Key: Disease -> List of (symptom, probability)
SYMPTOM_PROB = {
    "Flu": {
        "fever": 0.85, "cough": 0.80, "fatigue": 0.75, "body_ache": 0.80, 
        "runny_nose": 0.70, "sore_throat": 0.65, "shortness_of_breath": 0.10,
        "chest_pain": 0.15, "headache": 0.40, "loss_of_taste_smell": 0.05
    },
    "COVID-19": {
        "fever": 0.80, "cough": 0.85, "fatigue": 0.80, "loss_of_taste_smell": 0.75,
        "shortness_of_breath": 0.60, "body_ache": 0.50, "runny_nose": 0.30,
        "sore_throat": 0.40, "chest_pain": 0.30, "headache": 0.35
    },
    "Pneumonia": {
        "fever": 0.85, "cough": 0.90, "shortness_of_breath": 0.80, "chest_pain": 0.75,
        "fatigue": 0.70, "body_ache": 0.20, "runny_nose": 0.10, "sore_throat": 0.15,
        "headache": 0.20, "loss_of_taste_smell": 0.05
    },
    "Migraine": {
        "headache": 0.95, "fatigue": 0.50, "fever": 0.02, "cough": 0.02,
        "shortness_of_breath": 0.02, "chest_pain": 0.02, "sore_throat": 0.02,
        "body_ache": 0.15, "loss_of_taste_smell": 0.02, "runny_nose": 0.02
    },
    "Viral Infection": {
        "fever": 0.75, "sore_throat": 0.80, "fatigue": 0.65, "runny_nose": 0.70,
        "cough": 0.50, "body_ache": 0.40, "headache": 0.30, "shortness_of_breath": 0.05,
        "chest_pain": 0.05, "loss_of_taste_smell": 0.02
    }
}

def generate_synthetic_data(num_samples_per_disease=150, random_seed=42):
    np.random.seed(random_seed)
    data = []
    
    for disease in DISEASES:
        probs = SYMPTOM_PROB[disease]
        for _ in range(num_samples_per_disease):
            row = {}
            for symptom in SYMPTOMS:
                # Assign 1 or 0 based on symptom probability for this disease
                row[symptom] = 1 if np.random.rand() < probs[symptom] else 0
            row["disease"] = disease
            data.append(row)
            
    df = pd.DataFrame(data)
    # Shuffle dataset
    df = df.sample(frac=1, random_state=random_seed).reset_index(drop=True)
    return df

def train():
    print("Generating synthetic clinical dataset...")
    df = generate_synthetic_data(num_samples_per_disease=150)
    
    # Save the dataset to CSV
    os.makedirs("app/training", exist_ok=True)
    csv_path = "app/training/symptom_dataset.csv"
    df.to_csv(csv_path, index=False)
    print(f"Dataset generated with {len(df)} records and saved to {csv_path}.")
    
    # Split into features and label
    X = df[SYMPTOMS]
    y = df["disease"]
    
    # Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("\nTraining RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Training Accuracy on Test Set: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    os.makedirs("app/models", exist_ok=True)
    model_path = "app/models/disease_model.pkl"
    model_data = {
        "model": clf,
        "features": SYMPTOMS,
        "diseases": DISEASES
    }
    with open(model_path, "wb") as f:
        pickle.dump(model_data, f)
    print(f"Model successfully saved to {model_path}.")

if __name__ == "__main__":
    # Change working dir to backend if run directly
    if os.path.exists("backend"):
        os.chdir("backend")
    train()
