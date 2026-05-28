import React, { useState } from 'react';
import axios from 'axios';
import { Search, Brain, Sparkles, Activity, ShieldAlert, CheckCircle } from 'lucide-react';

const PRESETS = [
  {
    label: 'COVID-19 Symptoms',
    text: 'I have a high fever, dry cough, and I suddenly lost my sense of taste and smell. I also feel tired and have slight shortness of breath.'
  },
  {
    label: 'Flu Symptoms',
    text: 'I have a sudden high fever with chills, severe body aches, runny nose, sore throat, and a dry cough.'
  },
  {
    label: 'Pneumonia Symptoms',
    text: 'I am experiencing a severe wet cough, fever, and sharp chest pain when breathing. I feel very short of breath.'
  },
  {
    label: 'Migraine Symptoms',
    text: 'I have a severe throbbing headache on one side of my head and feel extremely fatigued.'
  },
  {
    label: 'Viral Infection',
    text: 'I have a mild fever, sore throat, runny nose, and feel slightly fatigued.'
  }
];

export default function SymptomAnalysis({ setPrediction, setActiveTab, triggerToast }) {
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    'Parsing natural language using spaCy NLP...',
    'Isolating key clinical symptom tokens...',
    'Evaluating Random Forest decision trees...',
    'Calculating severity score & risk factors...',
    'Writing report to SQLite log...'
  ];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptomText.trim()) {
      triggerToast('Please type your symptoms first!', 'error');
      return;
    }

    setLoading(true);
    setLoadingStep(0);

    // Dynamic loading text step updates
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await axios.post('http://localhost:8000/api/predict', {
        symptom_text: symptomText
      });
      
      clearInterval(interval);
      setPrediction(response.data);
      triggerToast('Symptom analysis complete!', 'success');
      setActiveTab('results');
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      const msg = error.response?.data?.detail || 'Failed to connect to clinical backend.';
      triggerToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Clinical Symptom Analysis
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Enter clinical notes or patient complaints in free text. The parser will extract symptoms and predict the pathology.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Input Form */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <form onSubmit={handleAnalyze}>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-bold text-slate-900 dark:text-white">
                  Patient Complaint/Symptom Notes
                </label>
                <span className="text-xs text-slate-400">Natural Language Input</span>
              </div>
              
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Describe how you are feeling... E.g., 'I have had a high fever and a persistent wet cough since yesterday. I also feel slight shortness of breath and chest tightness.'"
                className="w-full min-h-[160px] rounded-xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 shadow-inner focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                disabled={loading}
              />

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSymptomText('')}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  disabled={loading}
                >
                  Clear Text
                </button>
                
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-500/10 hover:from-primary-600 hover:to-cyan-600 transition-all"
                  disabled={loading}
                >
                  <Search className="h-4 w-4" />
                  Analyze Symptoms
                </button>
              </div>
            </form>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50/50 p-6 dark:border-primary-950/20 dark:bg-primary-950/10 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Clinical Engine Running
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {steps[loadingStep]}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Presets Sidebar */}
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 h-full">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Internship Demo Presets
            </h3>
            
            <div className="space-y-3">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setSymptomText(preset.text)}
                  className="w-full text-left rounded-xl border border-slate-100 hover:border-cyan-200 bg-slate-50 hover:bg-cyan-50/20 p-3 transition-all duration-150 dark:border-slate-800/80 dark:bg-slate-950 dark:hover:border-cyan-900/30"
                  disabled={loading}
                >
                  <span className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {preset.label}
                  </span>
                  <span className="block text-[11px] text-slate-400 line-clamp-2 dark:text-slate-500 leading-relaxed">
                    {preset.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
