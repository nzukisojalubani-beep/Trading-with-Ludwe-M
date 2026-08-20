import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { JournalEntry } from '../types';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Filter, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  MinusCircle,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

interface TradeJournalProps {
  isDarkMode: boolean;
}

export const TradeJournal: React.FC<TradeJournalProps> = ({ isDarkMode }) => {
  const { user, journalEntries, addJournalEntry, deleteJournalEntry, updateJournalEntry, signInWithGoogle } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Form State
  const [pair, setPair] = useState('EUR/USD');
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState('1.08500');
  const [stopLoss, setStopLoss] = useState('1.08200');
  const [takeProfit, setTakeProfit] = useState('1.09100');
  const [lotSize, setLotSize] = useState('0.10');
  const [riskPercent, setRiskPercent] = useState('1.0');
  const [outcome, setOutcome] = useState<'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN'>('OPEN');
  const [notes, setNotes] = useState('');

  // Performance Stats
  const stats = useMemo(() => {
    const total = journalEntries.length;
    const closed = journalEntries.filter((e) => e.outcome !== 'OPEN');
    const wins = journalEntries.filter((e) => e.outcome === 'WIN').length;
    const losses = journalEntries.filter((e) => e.outcome === 'LOSS').length;
    const winRate = closed.length > 0 ? Math.round((wins / closed.length) * 100) : 0;
    
    return {
      total,
      wins,
      losses,
      open: journalEntries.filter((e) => e.outcome === 'OPEN').length,
      winRate,
    };
  }, [journalEntries]);

  const filteredEntries = useMemo(() => {
    if (selectedFilter === 'ALL') return journalEntries;
    return journalEntries.filter((e) => e.outcome === selectedFilter);
  }, [journalEntries, selectedFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entryNum = parseFloat(entryPrice) || 0;
    const slNum = parseFloat(stopLoss) || 0;
    const tpNum = parseFloat(takeProfit) || 0;
    const lotNum = parseFloat(lotSize) || 0.01;
    const riskNum = parseFloat(riskPercent) || 1.0;

    await addJournalEntry({
      pair: pair.toUpperCase().trim(),
      direction,
      entryPrice: entryNum,
      stopLoss: slNum,
      takeProfit: tpNum,
      lotSize: lotNum,
      riskPercent: riskNum,
      outcome,
      notes: notes.trim() || 'Executed according to price action market structure.',
    });

    // Reset Form
    setNotes('');
    setIsFormOpen(false);
  };

  const calculateRR = (entry: number, sl: number, tp: number, dir: 'BUY' | 'SELL') => {
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    if (risk === 0) return '1:1';
    return `1:${(reward / risk).toFixed(1)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Cloud Sync Status */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">
              {user ? 'FIRESTORE CLOUD DATABASE CONNECTED' : 'LOCAL GUEST SESSION'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase mt-1">
            Trading Execution Journal
          </h1>
          <p className="text-xs font-mono text-white/50 dark:text-white/50 text-slate-500 uppercase tracking-wider mt-1">
            Log setups, track discipline, and eliminate emotional sizing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <button
              id="journal-google-signin-banner-btn"
              onClick={signInWithGoogle}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                isDarkMode ? 'bg-[#141414] border-white/10 hover:border-white/30 text-white' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Sign in to Cloud Sync</span>
            </button>
          )}

          <button
            id="open-log-trade-btn"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-orange-500 text-black hover:bg-orange-400 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isFormOpen ? 'Cancel' : 'Log New Trade'}</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-5 rounded-[24px] border ${
          isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">TOTAL LOGGED</div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight">{stats.total}</div>
          <div className="text-[10px] font-mono text-white/40 mt-1">EXECUTED SETUPS</div>
        </div>

        <div className={`p-5 rounded-[24px] border ${
          isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 mb-1">WIN RATE</div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-400">{stats.winRate}%</div>
          <div className="text-[10px] font-mono text-white/40 mt-1">{stats.wins} W / {stats.losses} L</div>
        </div>

        <div className={`p-5 rounded-[24px] border ${
          isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-widest text-orange-400 mb-1">ACTIVE TRADES</div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-orange-400">{stats.open}</div>
          <div className="text-[10px] font-mono text-white/40 mt-1">IN PROGRESS</div>
        </div>

        <div className={`p-5 rounded-[24px] border ${
          isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">DISCIPLINE TARGET</div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight">1:2 R:R</div>
          <div className="text-[10px] font-mono text-white/40 mt-1">LUDWE M MANDATE</div>
        </div>
      </div>

      {/* Log New Trade Form (Collapsible) */}
      {isFormOpen && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onSubmit={handleSubmit}
          className={`p-6 sm:p-8 rounded-[32px] border space-y-6 ${
            isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold uppercase tracking-tight">Record Trade Execution</h3>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              SAVED TO FIRESTORE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Currency Pair
              </label>
              <input
                id="trade-form-pair"
                type="text"
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                required
                className={`w-full px-4 py-2 text-xs font-mono uppercase rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="trade-form-dir-buy"
                  onClick={() => setDirection('BUY')}
                  className={`py-2 text-xs font-mono uppercase font-bold rounded-xl border transition-all ${
                    direction === 'BUY'
                      ? 'bg-emerald-500 text-black border-emerald-500'
                      : isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white/60' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  id="trade-form-dir-sell"
                  onClick={() => setDirection('SELL')}
                  className={`py-2 text-xs font-mono uppercase font-bold rounded-xl border transition-all ${
                    direction === 'SELL'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white/60' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Entry Price
              </label>
              <input
                id="trade-form-entry"
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                required
                className={`w-full px-4 py-2 text-xs font-mono rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Stop Loss (SL)
              </label>
              <input
                id="trade-form-sl"
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                required
                className={`w-full px-4 py-2 text-xs font-mono rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Take Profit (TP)
              </label>
              <input
                id="trade-form-tp"
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                required
                className={`w-full px-4 py-2 text-xs font-mono rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Lot Size
              </label>
              <input
                id="trade-form-lot"
                type="number"
                step="any"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                required
                className={`w-full px-4 py-2 text-xs font-mono rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Account Risk %
              </label>
              <input
                id="trade-form-risk"
                type="number"
                step="any"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                required
                className={`w-full px-4 py-2 text-xs font-mono rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
                Outcome Status
              </label>
              <select
                id="trade-form-outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as any)}
                className={`w-full px-4 py-2 text-xs font-mono uppercase rounded-xl border outline-none ${
                  isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <option value="OPEN">OPEN (Active)</option>
                <option value="WIN">WIN (Take Profit)</option>
                <option value="LOSS">LOSS (Stop Loss)</option>
                <option value="BREAKEVEN">BREAKEVEN</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-1">
              Technical Rationale & Notes
            </label>
            <textarea
              id="trade-form-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 4H Bullish Engulfing off key Support Zone with RSI Divergence..."
              className={`w-full px-4 py-2.5 text-xs font-mono rounded-xl border outline-none ${
                isDarkMode ? 'bg-[#1A1A1A] border-white/10 text-white placeholder-white/30' : 'bg-slate-100 border-slate-200'
              }`}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              id="trade-form-cancel-btn"
              onClick={() => setIsFormOpen(false)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider ${
                isDarkMode ? 'hover:bg-white/5 text-white/60' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="trade-form-save-btn"
              className="px-6 py-2.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider bg-white text-black hover:bg-slate-200"
            >
              Save Trade Entry
            </button>
          </div>
        </motion.form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          {['ALL', 'OPEN', 'WIN', 'LOSS', 'BREAKEVEN'].map((flt) => (
            <button
              key={flt}
              id={`filter-journal-${flt.toLowerCase()}`}
              onClick={() => setSelectedFilter(flt)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                selectedFilter === flt
                  ? isDarkMode
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-slate-900 text-white font-bold border-slate-900'
                  : isDarkMode
                    ? 'bg-[#141414] border-white/5 text-white/60 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {flt}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-white/40 shrink-0">
          SHOWING {filteredEntries.length} OF {journalEntries.length}
        </span>
      </div>

      {/* Journal Entries List */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const rr = calculateRR(entry.entryPrice, entry.stopLoss, entry.takeProfit, entry.direction);
            return (
              <div
                key={entry.id}
                id={`journal-card-${entry.id}`}
                className={`p-6 rounded-[28px] border transition-all ${
                  isDarkMode ? 'bg-[#141414] border-white/5 hover:border-white/20' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                      entry.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {entry.direction}
                    </span>
                    <div>
                      <h3 className="text-base font-bold font-mono uppercase tracking-tight">{entry.pair}</h3>
                      <span className="text-[10px] font-mono text-white/40">
                        {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Pill */}
                    <div className="flex items-center gap-1">
                      <select
                        id={`journal-outcome-select-${entry.id}`}
                        value={entry.outcome}
                        onChange={(e) => updateJournalEntry(entry.id, { outcome: e.target.value as any })}
                        className={`text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full border outline-none cursor-pointer ${
                          entry.outcome === 'WIN'
                            ? 'bg-emerald-500 text-black border-emerald-500'
                            : entry.outcome === 'LOSS'
                              ? 'bg-rose-500 text-white border-rose-500'
                              : entry.outcome === 'BREAKEVEN'
                                ? 'bg-amber-500 text-black border-amber-500'
                                : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                        }`}
                      >
                        <option value="OPEN">STATUS: OPEN</option>
                        <option value="WIN">STATUS: WIN</option>
                        <option value="LOSS">STATUS: LOSS</option>
                        <option value="BREAKEVEN">STATUS: BREAKEVEN</option>
                      </select>
                    </div>

                    <button
                      id={`delete-journal-entry-${entry.id}`}
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="p-1.5 rounded-full text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Entry Parameters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 py-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-white/40 block">ENTRY PRICE</span>
                    <span className="font-bold">{entry.entryPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">STOP LOSS</span>
                    <span className="font-bold text-rose-400">{entry.stopLoss}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">TAKE PROFIT</span>
                    <span className="font-bold text-emerald-400">{entry.takeProfit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">LOT SIZE</span>
                    <span className="font-bold">{entry.lotSize || 0.1}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">RISK %</span>
                    <span className="font-bold">{entry.riskPercent || 1}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">R:R RATIO</span>
                    <span className="font-bold text-orange-400">{rr}</span>
                  </div>
                </div>

                {/* Notes */}
                {entry.notes && (
                  <div className="pt-3 border-t border-white/5 text-xs text-white/70 font-mono">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">TRADING RATIONALE:</span>
                    <p className="leading-relaxed">{entry.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-16 px-6 rounded-[32px] border ${
          isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-slate-50 border-slate-200'
        }`}>
          <BookMarked className="w-12 h-12 mx-auto text-white/30 mb-4" />
          <h3 className="text-lg font-bold uppercase tracking-tight mb-2">
            No journal entries recorded
          </h3>
          <p className="text-xs font-mono text-white/50 max-w-sm mx-auto mb-6 uppercase tracking-wider">
            Start tracking your executions to build consistency and refine your risk habits.
          </p>
          <button
            id="empty-state-log-trade-btn"
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-orange-500 text-black hover:bg-orange-400 transition-colors"
          >
            Log First Trade
          </button>
        </div>
      )}
    </div>
  );
};
