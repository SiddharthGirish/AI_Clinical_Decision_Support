import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
            <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              <strong>Medical Disclaimer:</strong> This system uses a synthetic-trained machine learning model for informational purposes. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-600 font-medium shrink-0">
            © {new Date().getFullYear()} AI-CDSS Internship Project.
          </div>
        </div>
      </div>
    </footer>
  );
}
