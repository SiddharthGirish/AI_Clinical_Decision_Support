import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Calendar, Trash2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function History({ setPrediction, setActiveTab, triggerToast }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error(error);
      triggerToast('Failed to fetch clinical logs.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation(); // Avoid triggering card click (which views details)
    if (!window.confirm('Are you sure you want to delete this diagnosis record?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/history/${id}`);
      triggerToast('Diagnosis record deleted.', 'success');
      // Update local state
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error(error);
      triggerToast('Failed to delete history record.', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('WARNING: This will clear the entire SQLite history database. Proceed?')) return;
    
    try {
      await axios.delete('http://localhost:8000/api/history');
      triggerToast('All clinical history records cleared.', 'success');
      setHistory([]);
    } catch (error) {
      console.error(error);
      triggerToast('Failed to clear database logs.', 'error');
    }
  };

  const handleViewDetails = (item) => {
    // Reconstruct the response payload schema to pass to Results
    setPrediction({
      predicted_disease: item.predicted_disease,
      confidence: item.confidence,
      risk_level: item.risk_level,
      symptoms_detected: item.symptoms_detected,
      nlp_severity: item.nlp_severity || 'moderate',
      recommendations: item.recommendations
    });
    triggerToast('Loaded historical diagnosis.', 'info');
    setActiveTab('results');
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  const riskColors = {
    High: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
    Moderate: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    Low: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50'
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in font-sans">
      
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <HistoryIcon className="h-7 w-7 text-primary-500" />
            Clinical Records History
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A secure local SQLite ledger tracking all diagnostic predictions, NLP runs, and clinical assessments.
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start rounded-xl border border-red-200 hover:border-red-300 text-red-600 dark:text-red-400 dark:border-red-950 px-4 py-2 text-sm font-bold bg-white dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
          >
            Clear SQLite Logs
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading historical clinical logs...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center dark:border-slate-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 mx-auto mb-4">
            <HistoryIcon className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Clinical Logs Found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            The database is currently empty. Run a symptom analysis to generate a new report.
          </p>
          <button
            onClick={() => setActiveTab('analyze')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors"
          >
            Run First Analysis
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleViewDetails(item)}
              className="group cursor-pointer rounded-2xl border border-slate-200 hover:border-primary-300 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 hover:shadow-md transition-all duration-200 relative flex flex-col justify-between"
            >
              <div>
                {/* Date Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(item.timestamp)}
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => handleDeleteItem(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all shrink-0"
                    title="Delete diagnosis history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Disease Name & Confidence */}
                <div className="flex items-baseline gap-2 mb-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {item.predicted_disease}
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    ({item.confidence}% confidence)
                  </span>
                </div>

                {/* Risk Level Badge */}
                <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-bold mb-4 ${riskColors[item.risk_level] || 'bg-slate-50'}`}>
                  {item.risk_level} Risk
                </span>

                {/* Detected Symptoms */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.symptoms_detected.map((sym, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400"
                    >
                      {sym.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Action Link */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700 dark:text-primary-400">
                <span>View Full Medical Report</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
