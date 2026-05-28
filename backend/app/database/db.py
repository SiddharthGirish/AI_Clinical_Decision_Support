import os
import json
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create the predictions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            predicted_disease TEXT NOT NULL,
            confidence REAL NOT NULL,
            risk_level TEXT NOT NULL,
            symptoms_detected TEXT NOT NULL, -- JSON serialized list
            recommendations TEXT NOT NULL,    -- JSON serialized list
            timestamp TEXT NOT NULL
        )
    """)
    conn.commit()
    
    # Check if table is empty to pre-seed
    cursor.execute("SELECT COUNT(*) FROM predictions")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("Pre-seeding database with clinical records...")
        sample_records = [
            (
                "COVID-19",
                88.5,
                "High",
                json.dumps(["fever", "cough", "shortness_of_breath", "loss_of_taste_smell"]),
                json.dumps([
                    "Isolate immediately to prevent spreading the infection.",
                    "Monitor blood oxygen levels regularly.",
                    "Consult a physician or telemedicine service for medical guidance.",
                    "Seek emergency care if you experience severe breathing difficulty or persistent chest pain."
                ]),
                "2026-05-20T10:15:30"
            ),
            (
                "Migraine",
                95.0,
                "Low",
                json.dumps(["headache", "fatigue"]),
                json.dumps([
                    "Rest in a quiet, dark, and cool room.",
                    "Apply a cold compress or ice pack to your forehead or temples.",
                    "Ensure adequate hydration.",
                    "Avoid known migraine triggers like bright lights or strong odors."
                ]),
                "2026-05-20T12:45:10"
            ),
            (
                "Flu",
                82.0,
                "Moderate",
                json.dumps(["fever", "cough", "body_ache", "runny_nose", "sore_throat"]),
                json.dumps([
                    "Get plenty of bed rest to help your body fight the virus.",
                    "Stay well-hydrated by drinking water, herbal teas, or broths.",
                    "Consider over-the-counter pain relievers or fever reducers.",
                    "Avoid close contact with others to prevent transmission."
                ]),
                "2026-05-20T15:30:22"
            )
        ]
        
        cursor.executemany("""
            INSERT INTO predictions (predicted_disease, confidence, risk_level, symptoms_detected, recommendations, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        """, sample_records)
        conn.commit()
        print("Database pre-seeded successfully.")
        
    conn.close()

def save_prediction(predicted_disease, confidence, risk_level, symptoms_detected, recommendations):
    conn = get_db_connection()
    cursor = conn.cursor()
    timestamp = datetime.now().isoformat()
    
    cursor.execute("""
        INSERT INTO predictions (predicted_disease, confidence, risk_level, symptoms_detected, recommendations, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        predicted_disease,
        confidence,
        risk_level,
        json.dumps(symptoms_detected),
        json.dumps(recommendations),
        timestamp
    ))
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return inserted_id

def get_prediction_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM predictions ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    
    history = []
    for row in rows:
        history.append({
            "id": row["id"],
            "predicted_disease": row["predicted_disease"],
            "confidence": row["confidence"],
            "risk_level": row["risk_level"],
            "symptoms_detected": json.loads(row["symptoms_detected"]),
            "recommendations": json.loads(row["recommendations"]),
            "timestamp": row["timestamp"]
        })
    conn.close()
    return history

def delete_prediction(prediction_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions WHERE id = ?", (prediction_id,))
    conn.commit()
    conn.close()

def clear_prediction_history():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM predictions")
    conn.commit()
    conn.close()

