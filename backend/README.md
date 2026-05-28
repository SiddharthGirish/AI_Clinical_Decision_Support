# AI Clinical CDSS - Backend Service API

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)

This directory houses the backend server for the Clinical Decision Support System (CDSS). Built with **FastAPI**, it exposes endpoints for symptom extraction, supervised disease classification, risk assessment, and chatbot helper conversations.

---

## 🛠️ Key Technical Features

1. **FastAPI & Uvicorn**: High-performance, asynchronous REST API gateway serving requests on port `8000` with automated Swagger documentation (`/docs`).
2. **spaCy NLP Parsing**: Performs lemmatization and token filtering using the `en_core_web_sm` English model to extract clinical symptom concepts from unstructured patient input.
3. **Random Forest Classifier**: Machine Learning model trained using Scikit-Learn. The model automatically trains on startup if missing, utilizing the generated synthetic training dataset.
4. **Rule-Based Risk Stratification**: Scores patient symptoms and predicted diseases to classify risk levels (`Low`, `Moderate`, `High`) and dynamically compile list-based medical guidance.
5. **Generative AI Chatbot**: Integrates with the **Groq Cloud API** (Llama-3 model) for clinical wellness queries. Falls back to an offline rule-based responder tree if API keys are missing.
6. **SQLite Storage**: Uses python's native `sqlite3` library to persist clinical log entries for auditing. Automates database schema migration and table pre-seeding on first boot.

---

## 📂 Backend Architecture & Files

```
backend/
├── app/
│   ├── main.py                 # FastAPI Gateway (Middleware & Route initialization)
│   │
│   ├── database/
│   │   ├── db.py               # Database connections, insertion queries, and seeding
│   │   └── database.db         # Local SQLite DB file (Git ignored, generated at runtime)
│   │
│   ├── models/
│   │   └── disease_model.pkl   # Serialized RandomForest classifier (Git ignored, generated)
│   │
│   ├── routes/                 # REST Controller Endpoints
│   │   ├── predict.py          # POST /api/predict (Combines NLP, ML, Risk, and DB log)
│   │   ├── chat.py             # POST /api/chat (Proxies chatbot prompts to Groq / fallback)
│   │   └── history.py          # GET/DELETE /api/history (Controls DB logs retrieval/deletion)
│   │
│   ├── services/               # Core business/clinical logic modules
│   │   ├── nlp_service.py      # Token parsing, lemmatization, and token modifiers
│   │   ├── ml_service.py       # Handles ML model loading and inference vector mapping
│   │   ├── risk_service.py     # Custom heuristics for risk evaluation and recommendations
│   │   └── groq_service.py     # Groq API client with a fallback conversation trees
│   │
│   └── training/               # Offline model generation & datasets
│       ├── train_model.py      # Script to create synthetic CSV and train classifier
│       └── symptom_dataset.csv # Generated training set (750 samples)
│
├── .env                        # Local configurations (Groq keys, host, port)
├── .env.example                # Example env configurations
├── requirements.txt            # Python environment dependencies
└── README.md                   # This documentation file
```

---

## ⚡ Backend Local Setup

### 1. Prerequisites
Ensure you have **Python 3.10** or higher installed.

### 2. Set Up Virtual Environment
Initialize a clean Python virtual environment inside the `backend/` folder:
```bash
python -m venv .venv
```
Activate the environment:
* **Windows (PowerShell)**:
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
* **Linux / macOS**:
  ```bash
  source .venv/bin/activate
  ```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```
*Note: During installation, the spaCy English corpus (`en_core_web_sm`) will be downloaded. If it fails, you can download it manually with `python -m spacy download en_core_web_sm`.*

### 4. Configure Environment Files
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your Groq API key:
```ini
GROQ_API_KEY=gsk_your_actual_key_here
```
*If left blank, the app will gracefully fall back to the offline medical responder chatbot.*

### 5. Running the Application
Launch the live-reloaded development API server:
```bash
uvicorn app.main:app --reload
```
- The backend API runs at: [http://localhost:8000](http://localhost:8000)
- Swagger documentation is available at: [http://localhost:8000/docs](http://localhost:8000/docs)
- Interactive Redoc documentation is available at: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🤖 Model Training Pipeline

The machine learning model uses a **Random Forest Classifier** trained on symptom patterns. If the model binary file (`app/models/disease_model.pkl`) is missing on startup, the server automatically runs training. 

To train the classifier manually, execute the following command in the active virtual environment:
```bash
python app/training/train_model.py
```
This script will:
1. Generate `app/training/symptom_dataset.csv` (synthetic clinical patient profiles).
2. Split and stratify the logs (80% training, 20% test).
3. Train the model and output metrics (Accuracy, Precision, Recall, F1-Score).
4. Save the compiled model binary to `app/models/disease_model.pkl`.
