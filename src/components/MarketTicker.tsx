import React, { useEffect, useState } from 'react';
import { MarketQuote } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketTickerProps {
  quotes: MarketQuote[];
  onSelectQuote?: (symbol: string) => void;
  selectedSymbol?: string;
  isDarkMode: boolean;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({
  quotes,
  onSelectQuote,
  selectedSymbol,
  isDarkMode,
}) => {
  const [liveQuotes, setLiveQuotes] = useState<MarketQuote[]>(quotes);
  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down' | null>>({});

  useEffect(() => {
    setLiveQuotes(quotes);
  }, [quotes]);

  // Simulate subtle real-time market ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * liveQuotes.length);
      const target = liveQuotes[randomIndex];
      if (!target) return;

      const delta = (Math.random() - 0.49) * (target.price * 0.0003);
      const newPrice = Number((target.price + delta).toFixed(target.digits));
      const direction = delta >= 0 ? 'up' : 'down';

      setLiveQuotes((prev) =>
        prev.map((item, idx) => {
          if (idx === randomIndex) {
            const newChange = Number((item.change + delta).toFixed(target.digits));
            const newPercent = Number(((newChange / (item.price - newChange)) * 100).toFixed(2));
            return {
              ...item,
              price: newPrice,
              change: newChange,
              changePercent: newPercent,
              high: Math.max(item.high, newPrice),
              low: Math.min(item.low, newPrice),
            };
          }
          return item;
        })
      );

      setFlashMap((prev) => ({ ...prev, [target.symbol]: direction }));
      setTimeout(() => {
        setFlashMap((prev) => ({ ...prev, [target.symbol]: null }));
      }, 700);
    }, 2400);

    return () => clearInterval(interval);
  }, [liveQuotes]);

  return (
    <div className={`w-full overflow-x-auto no-scrollbar border-b py-2.5 text-xs transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] border-white/10 text-[#F0F0F0]' : 'bg-[#FAFAFA] border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 whitespace-nowrap min-w-max">
        <div className="flex items-center gap-2 font-mono uppercase tracking-widest text-[10px] text-white/50 dark:text-white/50 text-slate-500 pr-2 border-r border-white/10 dark:border-white/10 border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          <span>LIVE FEEDS</span>
        </div>

        {liveQuotes.map((quote) => {
          const isUp = quote.change >= 0;
          const flash = flashMap[quote.symbol];
          const isSelected = selectedSymbol === quote.symbol;

          let flashClass = '';
          if (flash === 'up') flashClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
          if (flash === 'down') flashClass = 'bg-rose-500/20 text-rose-400 border-rose-500/30';

          return (
            <button
              key={quote.symbol}
              id={`ticker-item-${quote.symbol.replace('/', '-')}`}
              onClick={() => onSelectQuote && onSelectQuote(quote.symbol)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                isSelected
                  ? isDarkMode
                    ? 'bg-white text-black font-bold border-white shadow-xs'
                    : 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                  : isDarkMode
                    ? 'bg-[#141414] border-white/5 text-white/80 hover:bg-white/10 hover:border-white/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              } ${flashClass}`}
            >
              <span className="font-bold tracking-tight">
                {quote.symbol}
              </span>
              <span className="opacity-90">
                {quote.price.toFixed(quote.digits)}
              </span>
              <span className={`flex items-center text-[10px] font-semibold ${
                isSelected 
                  ? isDarkMode ? (isUp ? 'text-emerald-700' : 'text-rose-700') : (isUp ? 'text-emerald-300' : 'text-rose-300')
                  : isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                {isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
