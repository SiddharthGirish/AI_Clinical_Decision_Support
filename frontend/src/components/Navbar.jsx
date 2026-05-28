import React from 'react';
import { Activity, Home, Search, FileText, MessageSquare, History as HistoryIcon, Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, hasPrediction }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analyze', label: 'Analyze Symptoms', icon: Search },
    { id: 'results', label: 'Diagnosis Results', icon: FileText, disabled: !hasPrediction },
    { id: 'chatbot', label: 'Clinical Chatbot', icon: MessageSquare },
    { id: 'history', label: 'History Logs', icon: HistoryIcon }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-cyan-400 text-white shadow-md shadow-primary-500/20">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-cyan-400 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-primary-400 dark:to-cyan-300">
              Clinical<span className="font-light">CDSS</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.disabled) {
                return (
                  <button
                    key={item.id}
                    disabled
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 dark:text-slate-700 cursor-not-allowed"
                    title="Analyze symptoms first to unlock results"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 py-3 space-y-1 shadow-lg transition-all duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-slate-300 dark:text-slate-800 cursor-not-allowed"
                >
                  <Icon className="h-5 w-5" />
                  {item.label} (Locked)
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
