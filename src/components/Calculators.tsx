import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MarketQuote } from '../types';
import { Calculator, ShieldAlert, TrendingUp, DollarSign, Percent, ArrowRight } from 'lucide-react';

interface CalculatorsProps {
  quotes: MarketQuote[];
  isDarkMode: boolean;
}

export const Calculators: React.FC<CalculatorsProps> = ({ quotes, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'position' | 'pip' | 'riskReward' | 'margin'>('position');

  // Position Size State
  const [accountBalance, setAccountBalance] = useState<number>(5000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [stopLossPips, setStopLossPips] = useState<number>(25);
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');

  // Pip Value State
  const [pipPair, setPipPair] = useState<string>('EUR/USD');
  const [pipLotSize, setPipLotSize] = useState<number>(1.0);

  // Risk Reward State
  const [entryPrice, setEntryPrice] = useState<number>(1.0850);
  const [slPrice, setSlPrice] = useState<number>(1.0820);
  const [tpPrice, setTpPrice] = useState<number>(1.0940);
  const [rrLots, setRrLots] = useState<number>(0.5);

  // Margin State
  const [marginBalance, setMarginBalance] = useState<number>(2000);
  const [leverage, setLeverage] = useState<number>(100);
  const [marginLots, setMarginLots] = useState<number>(1.0);

  // Calculation results:
  // 1. Position Size Calculator
  const riskAmount = (accountBalance * riskPercent) / 100;
  // 1 standard lot = $10/pip for USD quote pairs. JPY pairs approximately $6.50/pip depending on USD/JPY.
  const pipDollarValue = selectedPair.includes('JPY') ? 6.5 : 10;
  const calculatedLots = stopLossPips > 0 ? Number((riskAmount / (stopLossPips * pipDollarValue)).toFixed(2)) : 0;
  const miniLots = (calculatedLots * 10).toFixed(1);
  const microLots = (calculatedLots * 100).toFixed(0);

  // 2. Pip Value Calculator
  const singlePipValue = pipPair.includes('JPY') ? 6.5 : 10;
  const totalPipValue = (pipLotSize * singlePipValue).toFixed(2);

  // 3. Risk:Reward Calculator
  const riskPerUnit = Math.abs(entryPrice - slPrice);
  const rewardPerUnit = Math.abs(tpPrice - entryPrice);
  const rrRatio = riskPerUnit > 0 ? (rewardPerUnit / riskPerUnit).toFixed(2) : '0';
  const estimatedLoss = (riskPerUnit * 100000 * rrLots).toFixed(2);
  const estimatedGain = (rewardPerUnit * 100000 * rrLots).toFixed(2);

  // 4. Margin Calculator
  // Contract size = 100,000. Required Margin = (Lots * Contract size) / Leverage
  const requiredMargin = Number(((marginLots * 100000) / leverage).toFixed(2));
  const freeMargin = Number((marginBalance - requiredMargin).toFixed(2));
  const marginLevel = requiredMargin > 0 ? ((marginBalance / requiredMargin) * 100).toFixed(1) : 'N/A';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Forex Risk & Position Sizing Tools
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Professional risk management calculations taught by Ludwe M. Always verify your lot size before pulling the trigger.
        </p>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          id="calc-tab-position"
          onClick={() => setActiveTab('position')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'position'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Position Size Calculator
        </button>
        <button
          id="calc-tab-pip"
          onClick={() => setActiveTab('pip')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'pip'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pip Value Calculator
        </button>
        <button
          id="calc-tab-risk-reward"
          onClick={() => setActiveTab('riskReward')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'riskReward'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Risk-to-Reward & PnL
        </button>
        <button
          id="calc-tab-margin"
          onClick={() => setActiveTab('margin')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'margin'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Margin & Leverage
        </button>
      </div>

      {/* TAB CONTENT WITH FLUID MOTION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* TAB 1: Position Size Calculator */}
          {activeTab === 'position' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className={`md:col-span-7 p-6 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Trade Parameters
            </h3>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Account Balance ($ USD)</label>
              <input
                id="pos-calc-balance"
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(Math.max(1, parseFloat(e.target.value) || 0))}
                className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Risk Percentage (%)</label>
                <input
                  id="pos-calc-risk-pct"
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Stop Loss (Pips)</label>
                <input
                  id="pos-calc-sl-pips"
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Currency Pair</label>
              <select
                id="pos-calc-pair-select"
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {quotes.map((q) => (
                  <option key={q.symbol} value={q.symbol}>
                    {q.symbol} ({q.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Card */}
          <div className={`md:col-span-5 p-6 rounded-3xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Recommended Position Size
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-500/20 text-center">
                <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {calculatedLots} <span className="text-sm font-semibold">Standard Lots</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  or {miniLots} Mini Lots / {microLots} Micro Lots
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-emerald-500/10">
                  <span className="text-slate-600 dark:text-slate-400">Total Money at Risk:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">${riskAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-500/10">
                  <span className="text-slate-600 dark:text-slate-400">Risked Capital %:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{riskPercent}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Stop Loss Distance:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{stopLossPips} Pips</span>
                </div>
              </div>
            </div>

            <div className="pt-4 text-[11px] text-slate-500 flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Ludwe M Rule: Never risk more than 1% to 2% on any single trade to guarantee account survival through drawdowns.</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Pip Value Calculator */}
      {activeTab === 'pip' && (
        <div className={`p-6 rounded-3xl border max-w-2xl mx-auto space-y-6 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Instant Pip Value Calculation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Currency Pair</label>
              <select
                id="pip-pair-select"
                value={pipPair}
                onChange={(e) => setPipPair(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {quotes.map((q) => (
                  <option key={q.symbol} value={q.symbol}>{q.symbol}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Trade Volume (Lots)</label>
              <input
                id="pip-lot-size-input"
                type="number"
                step="0.01"
                value={pipLotSize}
                onChange={(e) => setPipLotSize(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Value of 1 Pip for {pipLotSize} Lot ({pipPair})
            </div>
            <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${totalPipValue} <span className="text-sm font-semibold">USD</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Risk-to-Reward & P&L Calculator */}
      {activeTab === 'riskReward' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className={`md:col-span-7 p-6 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Price Targets
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Entry Price</label>
                <input
                  id="rr-entry-price"
                  type="number"
                  step="0.0001"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs text-rose-500 block mb-1">Stop Loss</label>
                <input
                  id="rr-sl-price"
                  type="number"
                  step="0.0001"
                  value={slPrice}
                  onChange={(e) => setSlPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs text-emerald-500 block mb-1">Take Profit</label>
                <input
                  id="rr-tp-price"
                  type="number"
                  step="0.0001"
                  value={tpPrice}
                  onChange={(e) => setTpPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono outline-none ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Lot Size</label>
              <input
                id="rr-lot-size"
                type="number"
                step="0.01"
                value={rrLots}
                onChange={(e) => setRrLots(parseFloat(e.target.value) || 0.1)}
                className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className={`md:col-span-5 p-6 rounded-3xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Risk-to-Reward Ratio
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  1 : {rrRatio}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {parseFloat(rrRatio) >= 2 ? 'Optimal Strategy Edge' : 'Warning: Target below 1:2'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="text-rose-500 font-semibold">Potential Loss</div>
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 text-base">
                    -${estimatedLoss}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-emerald-500 font-semibold">Potential Gain</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">
                    +${estimatedGain}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Margin & Leverage */}
      {activeTab === 'margin' && (
        <div className={`p-6 rounded-3xl border max-w-2xl mx-auto space-y-6 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Margin & Leverage Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Account Balance ($)</label>
              <input
                id="margin-balance-input"
                type="number"
                value={marginBalance}
                onChange={(e) => setMarginBalance(parseFloat(e.target.value) || 0)}
                className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Broker Leverage</label>
              <select
                id="margin-leverage-select"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className={`w-full p-2.5 rounded-xl border text-sm font-semibold outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value={30}>1:30</option>
                <option value={50}>1:50</option>
                <option value={100}>1:100</option>
                <option value={200}>1:200</option>
                <option value={500}>1:500</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Volume (Lots)</label>
              <input
                id="margin-lots-input"
                type="number"
                step="0.1"
                value={marginLots}
                onChange={(e) => setMarginLots(parseFloat(e.target.value) || 0.1)}
                className={`w-full p-2.5 rounded-xl border text-sm font-mono outline-none ${
                  isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">Required Margin</div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                ${requiredMargin}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">Free Margin</div>
              <div className="text-lg font-black font-mono text-emerald-500">
                ${freeMargin}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-[11px] text-slate-500">Margin Level</div>
              <div className="text-lg font-black font-mono text-blue-500">
                {marginLevel}%
              </div>
            </div>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
