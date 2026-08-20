import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { AiChatMessage } from '../types';

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: { articleTitle?: string; defaultQuestion?: string };
  isDarkMode: boolean;
}

export const AiCoachDrawer: React.FC<AiCoachDrawerProps> = ({
  isOpen,
  onClose,
  initialContext,
  isDarkMode,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI Trading Coach for **Trading with Ludwe M**.\n\nHow can I help you master technical analysis, candlestick patterns, risk management, or mobile platform setups today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested prompt chips
  const promptChips = [
    'How do I spot a Bullish Engulfing candle?',
    'What is the 1-2% risk management rule?',
    'How do I set up MetaTrader 5 on mobile?',
    'What is the difference between Technical & Fundamental analysis?',
  ];

  // If initial context is passed (e.g. from article reader)
  useEffect(() => {
    if (initialContext?.defaultQuestion && isOpen) {
      handleSendMessage(initialContext.defaultQuestion, initialContext.articleTitle);
    }
  }, [initialContext, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, contextArticle?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          contextArticle: contextArticle || initialContext?.articleTitle,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || 'I could not generate a response. Please try again.';

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `I'm having trouble connecting right now. Please ensure your network is stable or ask another forex trading question.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className={`w-full max-w-lg h-full flex flex-col border-l shadow-2xl transition-all ${
        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-1.5">
                <span>Ludwe M AI Trading Coach</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Trained on Forex education, price action & risk management
              </p>
            </div>
          </div>

          <button
            id="close-ai-drawer-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isBot ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isBot
                    ? isDarkMode
                      ? 'bg-slate-900 border border-slate-800 text-slate-200'
                      : 'bg-slate-100 border border-slate-200 text-slate-800'
                    : 'bg-emerald-600 text-white'
                }`}>
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <div className={`text-[9px] mt-1.5 text-right ${
                    isBot ? 'text-slate-400' : 'text-emerald-200'
                  }`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                <span>Ludwe M Coach is analyzing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            id="ai-coach-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask about price action, RSI, lot sizing..."
            className={`flex-1 p-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-emerald-500 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            id="ai-coach-send-btn"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white transition-colors ${
              inputValue.trim() && !isLoading
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
