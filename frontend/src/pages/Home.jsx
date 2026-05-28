import React from 'react';
import { Search, BrainCircuit, Activity, Heart, History, MessageSquare, ArrowRight } from 'lucide-react';

export default function Home({ setActiveTab }) {
  const features = [
    {
      title: 'NLP Symptom Extraction',
      description: 'Parses natural language sentences using spaCy to isolate symptoms and extract severity indicators.',
      icon: BrainCircuit,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'ML Disease Classifier',
      description: 'Uses a Random Forest classifier trained on clinical features to predict the most likely disease.',
      icon: Activity,
      color: 'from-cyan-500 to-teal-500'
    },
    {
      title: 'Dynamic Risk Stratification',
      description: 'Flags urgent cases based on emergency symptoms, automatically classifying risk as Low, Moderate, or High.',
      icon: Heart,
      color: 'from-rose-500 to-pink-500'
    },
    {
      title: 'AI Follow-up Chatbot',
      description: 'Discusses symptoms and lifestyle recommendations using the Groq Llama API with local fallbacks.',
      icon: MessageSquare,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const stats = [
    { value: '97%+', label: 'Classifier Precision', detail: 'High precision on standard symptoms' },
    { value: '5+', label: 'Target Diseases', detail: 'Flu, COVID-19, Pneumonia, Migraine, Infection' },
    { value: '< 100ms', label: 'Inference Latency', detail: 'Real-time analysis pipeline' },
    { value: 'SQLite', label: 'Data Registry', detail: 'Local patient diagnosis history' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 shadow-2xl dark:bg-slate-950 sm:px-12 sm:py-20 md:px-16 md:py-24">
        {/* Glow Effects */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-400 backdrop-blur-sm mb-6">
            <Activity className="h-6 w-6" />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            AI-Powered Clinical
            <span className="block bg-gradient-to-r from-primary-400 to-cyan-300 bg-clip-text text-transparent">
              Decision Support System
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300 sm:text-xl">
            An internship showcase project integrating natural language parsing, supervised machine learning, and conversational AI to predict diseases and prioritize patient risk.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('analyze')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-cyan-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary-500/20 hover:from-primary-600 hover:to-cyan-600 transition-all hover:scale-[1.02]"
            >
              Start Symptom Analysis
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setActiveTab('chatbot')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-base font-bold text-white hover:bg-white/10 transition-all"
            >
              Talk to Medical AI
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Core Architecture Highlights
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            A look at the clinical pipeline. The frontend communicates with a FastAPI server to execute four decoupled intelligent routines.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${feature.color} text-white shadow-md shadow-slate-100 dark:shadow-none mb-5`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Specifications */}
      <div className="mt-20 border-t border-slate-200 pt-16 dark:border-slate-800">
        <div className="rounded-2xl bg-slate-50 p-8 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 text-center sm:text-left">
            Project Technical Specifications
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <div className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
