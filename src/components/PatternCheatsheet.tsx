import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TECHNICAL_PATTERNS } from '../data/patterns';
import { TechnicalPattern } from '../types';
import { Compass, CheckCircle2, TrendingUp, TrendingDown, HelpCircle, Layers } from 'lucide-react';

interface PatternCheatsheetProps {
  isDarkMode: boolean;
}

export const PatternCheatsheet: React.FC<PatternCheatsheetProps> = ({ isDarkMode }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedPattern, setSelectedPattern] = useState<TechnicalPattern>(TECHNICAL_PATTERNS[0]);

  const filtered = TECHNICAL_PATTERNS.filter(
    (p) => filterType === 'All' || p.type.toLowerCase().includes(filterType.toLowerCase())
  );

  const renderPatternVisual = (pattern: TechnicalPattern) => {
    switch (pattern.visualType) {
      case 'hammer':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
            {/* Hammer candle */}
            <line x1="50" y1="20" x2="50" y2="85" stroke="#10b981" strokeWidth="2.5" />
            <rect x="42" y="20" width="16" height="18" fill="#10b981" rx="2" />
          </svg>
        );
      case 'shooting_star':
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
            {/* Shooting star candle */}
            <line x1="50" y1="15" x2="50" y2="80" stroke="#ef4444" strokeWidth="2.5" />
            <rect x="42" y="62" width="16" height="18" fill="#ef4444" rx="2" />
          </svg>
        );
      case 'engulfing_bull':
        return (
          <svg viewBox="0 0 120 100" className="w-28 h-24 mx-auto">
            {/* First small red candle */}
            <line x1="40" y1="35" x2="40" y2="75" stroke="#ef4444" strokeWidth="2" />
            <rect x="33" y="42" width="14" height="24" fill="#ef4444" rx="1.5" />
            {/* Second large green engulfing candle */}
            <line x1="75" y1="15" x2="75" y2="85" stroke="#10b981" strokeWidth="2.5" />
            <rect x="65" y="25" width="20" height="52" fill="#10b981" rx="2" />
          </svg>
        );
      case 'engulfing_bear':
        return (
          <svg viewBox="0 0 120 100" className="w-28 h-24 mx-auto">
            {/* First small green candle */}
            <line x1="40" y1="30" x2="40" y2="70" stroke="#10b981" strokeWidth="2" />
            <rect x="33" y="38" width="14" height="24" fill="#10b981" rx="1.5" />
            {/* Second large red engulfing candle */}
            <line x1="75" y1="15" x2="75" y2="85" stroke="#ef4444" strokeWidth="2.5" />
            <rect x="65" y="22" width="20" height="54" fill="#ef4444" rx="2" />
          </svg>
        );
      case 'morning_star':
        return (
          <svg viewBox="0 0 140 100" className="w-32 h-24 mx-auto">
            {/* 1: Bear candle */}
            <line x1="30" y1="20" x2="30" y2="70" stroke="#ef4444" strokeWidth="2" />
            <rect x="22" y="25" width="16" height="38" fill="#ef4444" rx="1.5" />
            {/* 2: Star candle */}
            <line x1="70" y1="65" x2="70" y2="90" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="64" y="70" width="12" height="12" fill="#f59e0b" rx="1" />
            {/* 3: Bull candle */}
            <line x1="110" y1="25" x2="110" y2="75" stroke="#10b981" strokeWidth="2" />
            <rect x="102" y="30" width="16" height="38" fill="#10b981" rx="1.5" />
          </svg>
        );
      case 'evening_star':
        return (
          <svg viewBox="0 0 140 100" className="w-32 h-24 mx-auto">
            {/* 1: Bull candle */}
            <line x1="30" y1="30" x2="30" y2="80" stroke="#10b981" strokeWidth="2" />
            <rect x="22" y="35" width="16" height="38" fill="#10b981" rx="1.5" />
            {/* 2: Star candle */}
            <line x1="70" y1="10" x2="70" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
            <rect x="64" y="15" width="12" height="12" fill="#f59e0b" rx="1" />
            {/* 3: Bear candle */}
            <line x1="110" y1="25" x2="110" y2="80" stroke="#ef4444" strokeWidth="2" />
            <rect x="102" y="32" width="16" height="40" fill="#ef4444" rx="1.5" />
          </svg>
        );
      case 'double_bottom':
        return (
          <svg viewBox="0 0 140 100" className="w-32 h-24 mx-auto">
            {/* Neckline */}
            <line x1="10" y1="35" x2="130" y2="35" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth="1.5" />
            {/* W curve */}
            <path d="M 20 20 L 45 75 L 70 35 L 95 75 L 120 20" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'double_top':
        return (
          <svg viewBox="0 0 140 100" className="w-32 h-24 mx-auto">
            {/* Neckline */}
            <line x1="10" y1="65" x2="130" y2="65" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth="1.5" />
            {/* M curve */}
            <path d="M 20 80 L 45 25 L 70 65 L 95 25 L 120 80" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'head_and_shoulders':
        return (
          <svg viewBox="0 0 160 100" className="w-36 h-24 mx-auto">
            {/* Neckline */}
            <line x1="10" y1="70" x2="150" y2="70" stroke="#3b82f6" strokeDasharray="3 3" strokeWidth="1.5" />
            {/* Left shoulder, Head, Right shoulder */}
            <path d="M 20 70 L 45 40 L 65 70 L 85 18 L 105 70 L 125 45 L 145 70" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto">
            <line x1="50" y1="20" x2="50" y2="80" stroke="#94a3b8" strokeWidth="2" />
            <line x1="30" y1="50" x2="70" y2="50" stroke="#94a3b8" strokeWidth="3" />
          </svg>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Technical Patterns & Candlestick Cheatsheet
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Visual reference for high-probability candlestick formations and classical price patterns.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Bullish', 'Bearish', 'Reversal'].map((type) => (
            <button
              key={type}
              id={`pattern-filter-${type.toLowerCase()}`}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                    : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type} Patterns
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Pattern Selector on Left, Deep Dive on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Patterns Catalog (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((pattern) => {
            const isSelected = selectedPattern.id === pattern.id;
            const isBull = pattern.type.includes('Bullish');
            return (
              <div
                key={pattern.id}
                id={`pattern-card-${pattern.id}`}
                onClick={() => setSelectedPattern(pattern)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/30'
                    : isDarkMode
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBull ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                  }`}>
                    {pattern.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {pattern.category}
                  </span>
                </div>

                <div className="py-2 bg-slate-50 dark:bg-slate-950 rounded-xl mb-3 border border-slate-100 dark:border-slate-800/80">
                  {renderPatternVisual(pattern)}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {pattern.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {pattern.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Pattern Analysis (5 cols) */}
        <div className="lg:col-span-5">
          <div className={`sticky top-24 p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPattern.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      selectedPattern.type.includes('Bullish')
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-rose-500/20 text-rose-500'
                    }`}>
                      {selectedPattern.type}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {selectedPattern.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  {renderPatternVisual(selectedPattern)}
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Pattern Description</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedPattern.description}
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <Compass className="w-3.5 h-3.5 text-blue-500" />
                      <span>Market Psychology Behind the Setup</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedPattern.psychology}
                    </p>
                  </div>

                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Confirmation Criteria</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedPattern.confirmation}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-0.5">
                      Execution Rule
                    </div>
                    <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      {selectedPattern.tradingRule}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
