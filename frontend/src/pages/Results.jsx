import React from 'react';
import { ArrowLeft, MessageSquare, RefreshCw, AlertTriangle, ShieldCheck, Thermometer, Info } from 'lucide-react';

export default function Results({ prediction, setActiveTab }) {
  if (!prediction) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 mx-auto mb-4 border border-amber-200 dark:border-amber-900/30">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Diagnosis Available</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please input and analyze symptoms first to view results.
        </p>
        <button
          onClick={() => setActiveTab('analyze')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-primary-700 transition-colors"
        >
          Go to Symptom Analyzer
        </button>
      </div>
    );
  }

  const { predicted_disease, confidence, risk_level, symptoms_detected, nlp_severity, recommendations } = prediction;

  // Configuration for risk badges
  const riskConfig = {
    High: {
      color: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
      barColor: 'bg-red-500',
      icon: AlertTriangle,
      label: 'High Risk'
    },
    Moderate: {
      color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
      barColor: 'bg-amber-500',
      icon: Info,
      label: 'Moderate Risk'
    },
    Low: {
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
      barColor: 'bg-emerald-500',
      icon: ShieldCheck,
      label: 'Low Risk'
    }
  };

  const currentRisk = riskConfig[risk_level] || riskConfig.Low;
  const RiskIcon = currentRisk.icon;

  // Calculate SVG stroke offset for confidence gauge
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in font-sans">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('analyze')}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Analyze New Symptoms
      </button>

      {/* Main Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Left Column: Diagnosis & Score */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Diagnosis Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Predicted Pathology
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 mb-6">
              {predicted_disease}
            </h2>

            {/* Circular Progress Gauge */}
            <div className="relative flex justify-center items-center h-32 w-32 mx-auto mb-6">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-primary-500"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {confidence}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Confidence
                </span>
              </div>
            </div>

            {/* Risk Badge */}
            <div className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-extrabold ${currentRisk.color}`}>
              <RiskIcon className="h-4 w-4" />
              {currentRisk.label}
            </div>
          </div>

          {/* NLP Extracted Data Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              NLP Extraction Breakdown
            </h3>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-400 mb-2">Detected Symptoms ({symptoms_detected.length})</span>
                {symptoms_detected.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {symptoms_detected.map((sym, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/40 dark:border-slate-700/40"
                      >
                        {sym.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No exact symptom matches found in vocabulary.</span>
                )}
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-400 mb-1">Extracted Complaint Severity</span>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary-500" />
                  <span className="text-sm font-bold capitalize text-slate-800 dark:text-slate-200">
                    {nlp_severity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 h-full">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              Clinical Recommendations Checklist
            </h3>

            {risk_level === 'High' && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-950/20 dark:bg-red-950/10">
                <p className="text-xs text-red-800 dark:text-red-300 font-medium leading-relaxed">
                  ⚠️ <strong>Critical Alert:</strong> This symptom report lists emergency factors (such as breathing difficulty or chest pain) or indicates a severe progression. Immediate emergency care is advised.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-black mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rec}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('chatbot')}
                className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 px-5 py-3 text-sm font-bold shadow-md shadow-slate-900/10 dark:shadow-none transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                Ask Chatbot Follow-up Questions
              </button>
              
              <button
                onClick={() => setActiveTab('analyze')}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Re-Analyze Symptoms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
