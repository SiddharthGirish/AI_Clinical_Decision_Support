import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, MessageSquare, ShieldAlert, Sparkles, User, Activity } from 'lucide-react';

const SUGGESTIONS = [
  "How should I treat a mild fever?",
  "What are the typical symptoms of COVID-19?",
  "How can I manage migraine headaches at home?",
  "When should I go to the emergency room?"
];

export default function Chatbot({ triggerToast }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Clinical Assistant. I can help answer questions about common symptoms, explain diagnostic results, and provide general home care guidance. How can I help you today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend.trim();
    if (!text) return;

    // Append user message
    const updatedMessages = [...messages, { role: 'user', content: text }];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error(error);
      triggerToast('Could not fetch response from chat backend.', 'error');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ **System Error**: I failed to connect to the medical AI server. Please check that the backend is running on port 8000.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Custom regex-based markdown parser to render headings, bold text, and lists cleanly
  const parseBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderFormattedMessage = (rawText) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Check for headers (e.g. ### Header or ## Header)
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ') || line.startsWith('# ')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-2">
            {line.replace(/^#+\s/, '')}
          </h3>
        );
      }
      
      // Check for bullet lists (e.g. - item or * item)
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const cleanText = line.replace(/^[\s*-]+/, '').trim();
        return (
          <li key={idx} className="list-disc ml-5 text-sm my-1 leading-relaxed text-slate-700 dark:text-slate-300">
            {parseBoldText(cleanText)}
          </li>
        );
      }

      // Check for Warning boxes (e.g. ⚠️ Warning or contains EMERGENCY)
      if (line.includes('⚠️') || line.includes('EMERGENCY')) {
        return (
          <div key={idx} className="my-3 rounded-lg border border-red-200 bg-red-50/50 p-3 text-red-800 dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-300">
            {parseBoldText(line)}
          </div>
        );
      }

      // Standard text line
      if (line.trim()) {
        return (
          <p key={idx} className="text-sm my-1 leading-relaxed text-slate-700 dark:text-slate-300">
            {parseBoldText(line)}
          </p>
        );
      }

      return <div key={idx} className="h-1.5"></div>;
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in font-sans h-[calc(100vh-140px)] flex flex-col">
      
      {/* Disclaimer Top Alert */}
      <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-950/20 dark:bg-blue-950/10 flex items-start gap-2.5">
        <ShieldAlert className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
          <strong>Interactive Clinical Chat:</strong> Ask follow-up queries or discuss wellness remedies. This conversation is not private, do not enter real names or identifiers.
        </p>
      </div>

      {/* Chat Area Panel */}
      <div className="flex-grow rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 flex flex-col overflow-hidden">
        
        {/* Chat Bubbles */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, index) => {
            const isAI = msg.role === 'assistant';
            return (
              <div key={index} className={`flex gap-3 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                {/* Avatar Icon */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${
                  isAI 
                    ? 'bg-gradient-to-tr from-primary-600 to-cyan-400 shadow-primary-500/10' 
                    : 'bg-slate-500'
                }`}>
                  {isAI ? <Activity className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                </div>

                {/* Bubble Content */}
                <div className={`rounded-2xl border p-4 shadow-sm ${
                  isAI
                    ? 'bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800'
                    : 'bg-primary-500 border-primary-600 text-white dark:bg-primary-600 dark:border-primary-700'
                }`}>
                  {isAI ? (
                    <div>{renderFormattedMessage(msg.content)}</div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-cyan-400 text-white shadow-sm shadow-primary-500/10">
                <Activity className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 flex items-center gap-1.5 h-11">
                <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 typing-dot"></div>
                <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 typing-dot"></div>
                <div className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600 typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 dark:bg-slate-900/20 dark:border-slate-800/50 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-500" /> Suggestions:
          </span>
          {SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="text-[11px] font-bold text-primary-600 hover:text-primary-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-primary-300 transition-colors shadow-sm dark:bg-slate-950 dark:border-slate-800 dark:text-primary-400 dark:hover:text-primary-300"
              disabled={loading}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Form Input Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a medical/symptom question..."
              className="flex-grow rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-inner focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              disabled={loading}
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white shadow-md shadow-primary-500/10 hover:bg-primary-600 transition-colors"
              disabled={loading || !inputText.trim()}
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
