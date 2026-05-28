# Emergency symptoms that trigger immediate High risk
EMERGENCY_SYMPTOMS = ["shortness_of_breath", "chest_pain"]

# Recommendations database by disease
DISEASE_RECOMMENDATIONS = {
    "COVID-19": [
        "Isolate in a separate room from other household members.",
        "Monitor your blood oxygen levels (SpO2) using a pulse oximeter if available.",
        "Stay hydrated by drinking plenty of water, broth, or electrolyte solutions.",
        "Get plenty of rest and avoid strenuous physical activity.",
        "Use over-the-counter fever reducers (like acetaminophen/paracetamol) if needed and approved by a pharmacist.",
        "Seek immediate emergency medical attention if you experience severe shortness of breath or persistent chest pressure."
    ],
    "Flu": [
        "Get ample bed rest to support your immune system.",
        "Drink warm liquids such as herbal tea, warm water with lemon, or broths to soothe throat and stay hydrated.",
        "Avoid close contact with others to prevent spreading the virus.",
        "Consider taking warm steam showers or using a humidifier to relieve nasal congestion.",
        "Take over-the-counter pain/fever medication (e.g., ibuprofen or acetaminophen) to alleviate body aches.",
        "Consult a doctor within 48 hours of symptom onset to discuss antiviral prescription if risk factors exist."
    ],
    "Pneumonia": [
        "Schedule an urgent consultation with a healthcare provider. Pneumonia often requires prescription treatments.",
        "Get extensive rest and avoid any exertion.",
        "Practice deep breathing exercises periodically to help clear lungs.",
        "Stay hydrated to help thin mucus in your chest.",
        "Monitor your temperature and breathing rate closely.",
        "Go to the emergency department immediately if you develop blue lips, confusion, or severe breathing difficulties."
    ],
    "Migraine": [
        "Rest in a quiet, dark, and cool room with closed eyes.",
        "Apply a cold compress or an ice pack wrapped in a cloth to your forehead or the back of your neck.",
        "Ensure you are fully hydrated, as dehydration is a common migraine trigger.",
        "Limit screen time (phones, TVs, computers) and avoid loud noises.",
        "Consider taking over-the-counter pain relievers (like ibuprofen or aspirin-caffeine-acetaminophen combos) early in the attack.",
        "Keep a symptom diary to identify trigger foods or activities for future prevention."
    ],
    "Viral Infection": [
        "Rest and allow your body's immune system to fight the infection.",
        "Stay well hydrated by drinking fluids throughout the day.",
        "Gargle with warm salt water to relieve throat soreness.",
        "Avoid smoking or exposure to secondhand smoke.",
        "Monitor your temperature; seek medical advice if fever persists for more than 3-4 days.",
        "Maintain good hand hygiene to prevent spreading the infection."
    ]
}

def evaluate_risk(predicted_disease: str, symptoms_list: list, nlp_severity: str) -> tuple:
    """
    Evaluates clinical risk level (Low, Moderate, High) and provides recommendations.
    Returns: (risk_level, recommendations_list)
    """
    # 1. Determine Risk Level
    # Rule 1: Emergency symptoms present -> High Risk
    has_emergency = any(symptom in symptoms_list for symptom in EMERGENCY_SYMPTOMS)
    
    if has_emergency:
        risk_level = "High"
    # Rule 2: High severity from NLP or Pneumonia -> High or Moderate
    elif nlp_severity == "high" or predicted_disease == "Pneumonia":
        risk_level = "High"
    # Rule 3: COVID-19 or Flu with moderate severity -> Moderate
    elif predicted_disease in ["COVID-19", "Flu"] or nlp_severity == "moderate":
        risk_level = "Moderate"
    # Rule 4: Mild/Low severity and benign diseases -> Low
    else:
        risk_level = "Low"
        
    # 2. Get recommendations
    recommendations = DISEASE_RECOMMENDATIONS.get(predicted_disease, [
        "Rest and monitor your symptoms closely.",
        "Ensure adequate fluid intake.",
        "Consult a healthcare professional if symptoms worsen or persist."
    ]).copy()
    
    # 3. Inject risk-specific alerts/recommendations
    if risk_level == "High":
        recommendations.insert(0, "CRITICAL: Seek immediate consultation with a healthcare professional or visit the nearest emergency room.")
    elif risk_level == "Moderate":
        recommendations.insert(0, "Schedule an appointment with your family physician or visit an urgent care center for verification.")
        
    return risk_level, recommendations
