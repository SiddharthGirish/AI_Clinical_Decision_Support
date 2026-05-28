import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import SymptomAnalysis from './pages/SymptomAnalysis';
import Results from './pages/Results';
import Chatbot from './pages/Chatbot';
import History from './pages/History';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(() => {
    // Load initial dark mode setting from localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Holds the last symptom prediction result
  const [prediction, setPrediction] = useState(null);
  
  // Toast notifications state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  // Sync dark mode state with document class list & localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const triggerToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Render the selected tab page
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'analyze':
        return (
          <SymptomAnalysis 
            setPrediction={setPrediction} 
            setActiveTab={setActiveTab} 
            triggerToast={triggerToast} 
          />
        );
      case 'results':
        return <Results prediction={prediction} setActiveTab={setActiveTab} />;
      case 'chatbot':
        return <Chatbot triggerToast={triggerToast} />;
      case 'history':
        return (
          <History 
            setPrediction={setPrediction} 
            setActiveTab={setActiveTab} 
            triggerToast={triggerToast} 
          />
        );
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        hasPrediction={!!prediction} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer Banner */}
      <Footer />

      {/* Alert Notifications Overlay */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
    </div>
  );
}
