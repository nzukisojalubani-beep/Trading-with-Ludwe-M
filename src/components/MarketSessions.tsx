import React, { useState, useEffect } from 'react';
import { TRADING_SESSIONS, ECONOMIC_EVENTS } from '../data/marketData';
import { TradingSession, EconomicEvent } from '../types';
import { Clock, Globe, AlertTriangle, Sparkles, Calendar, ArrowUpRight } from 'lucide-react';

interface MarketSessionsProps {
  isDarkMode: boolean;
}

export const MarketSessions: React.FC<MarketSessionsProps> = ({ isDarkMode }) => {
  const [currentUtcTime, setCurrentUtcTime] = useState<string>('');
  const [currentLocalTime, setCurrentLocalTime] = useState<string>('');
  const [currentUtcHour, setCurrentUtcHour] = useState<number>(0);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setCurrentUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
      setCurrentLocalTime(now.toLocaleTimeString());
      setCurrentUtcHour(now.getUTCHours());
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine if a session is currently active based on UTC hour
  const isSessionActive = (session: TradingSession) => {
    if (session.openUtc < session.closeUtc) {
      return currentUtcHour >= session.openUtc && currentUtcHour < session.closeUtc;
    } else {
      // Over midnight wrap (e.g. Sydney 22 to 7 UTC)
      return currentUtcHour >= session.openUtc || currentUtcHour < session.closeUtc;
    }
  };

  // Overlap window: London (08-16) & New York (13-21) overlap between 13:00 and 16:00 UTC
  const isLondonNyOverlap = currentUtcHour >= 13 && currentUtcHour < 16;

  const getImpactBadge = (impact: string) => {
    const upper = impact.toUpperCase();
    switch (upper) {
      case 'HIGH':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Clocks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Global Trading Sessions & Economic Calendar
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Timing is everything in forex. Monitor active regional liquidity centers and high-impact macro announcements.
          </p>
        </div>

        {/* Real-time Digital Clocks */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-mono">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Universal Time</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{currentUtcTime}</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center font-mono">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Your Local Time</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{currentLocalTime}</div>
          </div>
        </div>
      </div>

      {/* London-New York Overlap Alert Banner */}
      {isLondonNyOverlap ? (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <strong>Active Session Overlap:</strong> The London & New York markets are currently open simultaneously (13:00 - 16:00 UTC). This period represents the highest global liquidity and trade volume.
          </div>
        </div>
      ) : (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
          isDarkMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Ludwe M Tip:</strong> The highest volatility breakout setups typically occur during the London open (08:00 UTC) and the London/NY Overlap (13:00 - 16:00 UTC).
          </span>
        </div>
      )}

      {/* 4 Sessions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRADING_SESSIONS.map((session) => {
          const active = isSessionActive(session);
          return (
            <div
              key={session.name}
              className={`p-5 rounded-3xl border transition-all ${
                active
                  ? 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/40'
                  : isDarkMode
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {session.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  active
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
                  <span>{active ? 'OPEN' : 'CLOSED'}</span>
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                <div>City: {session.city}</div>
                <div className="font-mono mt-0.5">Hours: {session.openTime} - {session.closeTime} UTC</div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 mb-1">Key Currencies:</div>
                <div className="flex flex-wrap gap-1">
                  {(session.pairs || session.dominantPairs || []).map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Economic News Calendar Table */}
      <div className={`p-6 rounded-3xl border ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              High-Impact Economic Calendar
            </h3>
          </div>
          <span className="text-xs text-slate-400">Filtered for Major Market Drivers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Time (UTC)</th>
                <th className="pb-3">Currency</th>
                <th className="pb-3">Impact</th>
                <th className="pb-3">Event</th>
                <th className="pb-3">Actual</th>
                <th className="pb-3">Forecast</th>
                <th className="pb-3">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {ECONOMIC_EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 text-slate-500">{event.time}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{event.currency}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getImpactBadge(event.impact)}`}>
                      {event.impact}
                    </span>
                  </td>
                  <td className="py-3 font-sans font-medium text-slate-800 dark:text-slate-200">{event.event}</td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{event.actual || '—'}</td>
                  <td className="py-3 text-slate-500">{event.forecast}</td>
                  <td className="py-3 text-slate-400">{event.previous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
