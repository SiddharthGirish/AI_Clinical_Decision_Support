import os
from dotenv import load_dotenv
import requests

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()

# System prompt to set professional clinical assistant guidelines
SYSTEM_PROMPT = (
    "You are a helpful, professional, and empathetic AI Clinical Assistant. "
    "Your goal is to provide supportive healthcare information, explain medical terms, and offer wellness guidance. "
    "Guidelines:\n"
    "1. Keep answers concise, clear, and easy for a patient to understand.\n"
    "2. Explain symptoms, possible conditions, and lifestyle recommendations.\n"
    "3. ALWAYS advise consulting a healthcare professional for diagnosis or treatment changes.\n"
    "4. For emergency symptoms (e.g., chest pain, severe shortness of breath), immediately urge the user to seek emergency care.\n"
    "5. Do not make definitive diagnoses."
)

DISCLAIMER = "\n\n*Disclaimer: I am an AI Clinical Assistant, not a doctor. This information is for educational purposes. Please consult a qualified medical professional for diagnosis and treatment.*"

def mock_medical_chat(messages: list) -> str:
    """
    Rule-based mock conversation engine when Groq API Key is not set.
    Reads the user's latest query and returns an intelligent, structured response.
    """
    if not messages:
        return "Hello! I am your AI Clinical Assistant. How can I help you today?"
        
    # Get last message content
    last_msg = messages[-1].get("content", "").lower()
    
    # Check for emergency signs
    if "chest pain" in last_msg or "breathing" in last_msg or "shortness of breath" in last_msg or "suffocating" in last_msg:
        return (
            "### ⚠️ EMERGENCY WARNING\n"
            "Your symptoms (chest pain or breathing difficulty) could indicate a serious or life-threatening condition. "
            "Please **call emergency services immediately** or go to the nearest emergency department.\n\n"
            "Do not wait to see if symptoms improve." + DISCLAIMER
        )
        
    if "hello" in last_msg or "hi " in last_msg or last_msg == "hi" or "hey" in last_msg:
        return (
            "Hello! I am your AI Clinical Assistant. "
            "I can help you understand symptoms, explain predictions, and provide general health recommendations. "
            "What health questions or symptoms can I help you with today?"
        )
        
    if "covid" in last_msg or "corona" in last_msg:
        return (
            "### COVID-19 Information\n"
            "COVID-19 is a respiratory disease caused by the SARS-CoV-2 virus. Common symptoms include fever, dry cough, tiredness, and loss of taste or smell.\n\n"
            "**Key recommendations:**\n"
            "- Isolate at home to prevent spreading.\n"
            "- Monitor oxygen saturation levels using a pulse oximeter.\n"
            "- Keep hydrated and rest.\n"
            "- Seek medical attention if you experience breathing difficulties." + DISCLAIMER
        )
        
    if "flu" in last_msg or "influenza" in last_msg:
        return (
            "### Influenza (Flu) Information\n"
            "The flu is a common viral infection of the respiratory tract. Key symptoms include high fever, severe body aches, fatigue, sore throat, and a dry cough.\n\n"
            "**Management advice:**\n"
            "- Rest in bed and drink plenty of warm fluids.\n"
            "- Over-the-counter pain relievers can help with muscle aches and fever.\n"
            "- Antiviral medications may be prescribed by a doctor if caught early." + DISCLAIMER
        )
        
    if "pneumonia" in last_msg:
        return (
            "### Pneumonia Information\n"
            "Pneumonia is an infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus. "
            "It can range from mild to life-threatening.\n\n"
            "**Important:**\n"
            "- This condition usually requires evaluation by a medical professional and prescription treatments (like antibiotics).\n"
            "- Rest, stay hydrated, and monitor breathing closely." + DISCLAIMER
        )
        
    if "migraine" in last_msg or "headache" in last_msg:
        return (
            "### Migraine and Headache Care\n"
            "Migraines are intense headaches often accompanied by nausea, sensitivity to light/sound, or visual aura. "
            "General headaches can be caused by tension, dehydration, or eye strain.\n\n"
            "**Symptom relief tips:**\n"
            "- Rest in a dark, quiet, and cool room.\n"
            "- Place a cold compress on your forehead or temples.\n"
            "- Hydrate well, as dehydration is a major trigger." + DISCLAIMER
        )
        
    if "fever" in last_msg:
        return (
            "### Managing Fever\n"
            "A fever is typically a sign that your body is fighting off an infection. "
            "It is generally defined as a body temperature of 100.4°F (38°C) or higher.\n\n"
            "**Fever management:**\n"
            "- Drink water, clear broth, or herbal teas.\n"
            "- Dress in lightweight clothing and use light blankets.\n"
            "- Take fever-reducing medication (like paracetamol/acetaminophen) as directed." + DISCLAIMER
        )
        
    # Default responsive fallback
    return (
        "I understand you are inquiring about health issues. "
        "As your AI Clinical Assistant, I can explain that general management for mild symptoms includes rest, keeping well-hydrated, and monitoring symptoms.\n\n"
        "If you would like details on a specific condition like Flu, COVID-19, Pneumonia, or Migraines, please ask me! "
        "Remember, if symptoms are severe or worsening, it is crucial to consult a healthcare provider." + DISCLAIMER
    )

def ask_groq(messages: list) -> str:
    """
    Sends the list of chat messages to Groq API.
    If API key is missing or request fails, falls back gracefully.
    """
    # Check if API Key is configured
    if not GROQ_API_KEY or GROQ_API_KEY == "your_groq_api_key_here":
        print("Groq API Key is not set. Using rule-based fallback response.")
        return mock_medical_chat(messages)
        
    try:
        # We can use the groq package if installed, or direct API request. Let's do a direct requests post
        # to avoid versioning/install discrepancies with the SDK, which is super stable.
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Prepare payload with system prompt
        api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in messages:
            # Keep only role and content keys
            api_messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
            
        payload = {
            "model": GROQ_MODEL,
            "messages": api_messages,
            "temperature": 0.5,
            "max_tokens": 800
        }
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            reply = result["choices"][0]["message"]["content"]
            # Append disclaimer to Groq's reply
            if "disclaimer" not in reply.lower():
                reply += DISCLAIMER
            return reply
        else:
            print(f"Groq API Error ({response.status_code}): {response.text}")
            return mock_medical_chat(messages)
            
    except Exception as e:
        print(f"Exception during Groq API call: {e}")
        return mock_medical_chat(messages)
