import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50',
    error: 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/50'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up bg-white/95 dark:bg-slate-900/95 shadow-slate-100 dark:shadow-none font-sans select-none">
      <div className={`flex items-center gap-3 ${bgColors[type]} p-1 rounded-lg`}>
        {icons[type]}
      </div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-grow">
        {message}
      </p>
      <button 
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
