import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CandleData, MarketQuote, TradePosition } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  Activity, 
  Sliders, 
  DollarSign, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  BarChart2,
  Maximize2
} from 'lucide-react';

interface TradingViewSimProps {
  quotes: MarketQuote[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  isDarkMode: boolean;
}

export const TradingViewSim: React.FC<TradingViewSimProps> = ({
  quotes,
  selectedSymbol,
  onSelectSymbol,
  isDarkMode,
}) => {
  const currentQuote = quotes.find((q) => q.symbol === selectedSymbol) || quotes[0];
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '1D'>('15M');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);
  const [showEMA200, setShowEMA200] = useState(false);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showRSI, setShowRSI] = useState(true);
  const [isLiveTicking, setIsLiveTicking] = useState(true);

  // Crosshair state
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  // Simulated Account State
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [positions, setPositions] = useState<TradePosition[]>([]);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [lotSize, setLotSize] = useState<number>(0.1);
  const [stopLossPips, setStopLossPips] = useState<number>(20);
  const [takeProfitPips, setTakeProfitPips] = useState<number>(40);
  const [orderMessage, setOrderMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Generate Candle Data History
  const [candles, setCandles] = useState<CandleData[]>([]);

  // Generate initial candle series
  useEffect(() => {
    const count = 45;
    const basePrice = currentQuote.price;
    const digits = currentQuote.digits;
    const generated: CandleData[] = [];
    let current = basePrice * 0.985;

    const now = Date.now();
    const intervalMap: Record<string, number> = {
      '1M': 60 * 1000,
      '5M': 5 * 60 * 1000,
      '15M': 15 * 60 * 1000,
      '1H': 60 * 60 * 1000,
      '1D': 24 * 60 * 60 * 1000,
    };
    const stepMs = intervalMap[timeframe] || 15 * 60 * 1000;

    for (let i = count; i >= 0; i--) {
      const timeMs = now - i * stepMs;
      const d = new Date(timeMs);
      const timeStr = timeframe === '1D' 
        ? `${d.getMonth() + 1}/${d.getDate()}` 
        : `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

      const volatility = basePrice * 0.0012;
      const open = current;
      const change = (Math.random() - 0.48) * volatility;
      const close = Number((open + change).toFixed(digits));
      const high = Number((Math.max(open, close) + Math.random() * volatility * 0.6).toFixed(digits));
      const low = Number((Math.min(open, close) - Math.random() * volatility * 0.6).toFixed(digits));
      const volume = Math.floor(Math.random() * 400 + 100);

      current = close;
      generated.push({
        time: timeStr,
        timestamp: timeMs,
        open,
        high,
        low,
        close,
        volume,
      });
    }

    // Compute technical indicators
    for (let i = 0; i < generated.length; i++) {
      // SMA 20
      if (i >= 19) {
        const slice20 = generated.slice(i - 19, i + 1);
        const sum20 = slice20.reduce((acc, c) => acc + c.close, 0);
        generated[i].ma20 = Number((sum20 / 20).toFixed(digits));

        // Bollinger Bands (20, 2 std dev)
        const mean = sum20 / 20;
        const variance = slice20.reduce((acc, c) => acc + Math.pow(c.close - mean, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        generated[i].upperBand = Number((mean + 2 * stdDev).toFixed(digits));
        generated[i].lowerBand = Number((mean - 2 * stdDev).toFixed(digits));
      }

      // SMA 50
      if (i >= 49) {
        const slice50 = generated.slice(i - 49, i + 1);
        const sum50 = slice50.reduce((acc, c) => acc + c.close, 0);
        generated[i].ma50 = Number((sum50 / 50).toFixed(digits));
      } else if (i >= 10) {
        const slice = generated.slice(0, i + 1);
        generated[i].ma50 = Number((slice.reduce((acc, c) => acc + c.close, 0) / slice.length).toFixed(digits));
      }

      // RSI (14 period)
      if (i >= 14) {
        let gains = 0;
        let losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = generated[j].close - generated[j - 1].close;
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        if (avgLoss === 0) {
          generated[i].rsi = 100;
        } else {
          const rs = avgGain / avgLoss;
          generated[i].rsi = Number((100 - (100 / (1 + rs))).toFixed(1));
        }
      } else {
        generated[i].rsi = 50;
      }
    }

    setCandles(generated);
  }, [selectedSymbol, timeframe]);

  // Live price ticking & active position PnL updates
  useEffect(() => {
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        const delta = (Math.random() - 0.49) * (last.close * 0.0002);
        const newClose = Number((last.close + delta).toFixed(currentQuote.digits));
        last.close = newClose;
        last.high = Math.max(last.high, newClose);
        last.low = Math.min(last.low, newClose);
        last.volume += Math.floor(Math.random() * 5);

        // Update positions with live current price
        setPositions((currentPositions) =>
          currentPositions.map((pos) => {
            if (pos.symbol === currentQuote.symbol) {
              const pipUnit = Math.pow(10, -currentQuote.pipDecimal);
              const pipDiff = pos.type === 'BUY'
                ? (newClose - pos.entryPrice) / pipUnit
                : (pos.entryPrice - newClose) / pipUnit;
              // 1 standard lot = $10/pip on major pairs
              const pnl = Number((pipDiff * pos.lotSize * 10).toFixed(2));
              return { ...pos, currentPrice: newClose, pnl };
            }
            return pos;
          })
        );

        return [...prev.slice(0, -1), last];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [isLiveTicking, currentQuote]);

  // Computed floating PnL and Equity
  const totalFloatingPnl = useMemo(() => {
    return Number(positions.reduce((acc, pos) => acc + pos.pnl, 0).toFixed(2));
  }, [positions]);

  const equity = Number((accountBalance + totalFloatingPnl).toFixed(2));

  // Chart Canvas rendering calculation
  const chartMinMax = useMemo(() => {
    if (candles.length === 0) return { min: 0, max: 1 };
    let min = Infinity;
    let max = -Infinity;
    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.upperBand && c.upperBand > max) max = c.upperBand;
      if (c.lowerBand && c.lowerBand < min) min = c.lowerBand;
    });
    const padding = (max - min) * 0.08;
    return { min: min - padding, max: max + padding };
  }, [candles]);

  // Execute Simulated Order
  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    if (lotSize <= 0) {
      setOrderMessage({ text: 'Invalid lot size', type: 'error' });
      return;
    }

    const entryPrice = candles.length > 0 ? candles[candles.length - 1].close : currentQuote.price;
    const pipUnit = Math.pow(10, -currentQuote.pipDecimal);

    const slPrice = stopLossPips > 0 
      ? (type === 'BUY' ? entryPrice - stopLossPips * pipUnit : entryPrice + stopLossPips * pipUnit)
      : undefined;

    const tpPrice = takeProfitPips > 0
      ? (type === 'BUY' ? entryPrice + takeProfitPips * pipUnit : entryPrice - takeProfitPips * pipUnit)
      : undefined;

    const newPosition: TradePosition = {
      id: `pos-${Date.now()}`,
      symbol: currentQuote.symbol,
      type,
      entryPrice,
      currentPrice: entryPrice,
      lotSize,
      stopLoss: slPrice ? Number(slPrice.toFixed(currentQuote.digits)) : undefined,
      takeProfit: tpPrice ? Number(tpPrice.toFixed(currentQuote.digits)) : undefined,
      pnl: 0,
      openTime: new Date().toLocaleTimeString(),
    };

    setPositions((prev) => [newPosition, ...prev]);
    setOrderMessage({
      text: `${type} order executed for ${lotSize} Lots @ ${entryPrice.toFixed(currentQuote.digits)}`,
      type: 'success',
    });
    setTimeout(() => setOrderMessage(null), 3000);
  };

  const handleClosePosition = (id: string) => {
    const target = positions.find((p) => p.id === id);
    if (!target) return;
    setAccountBalance((prev) => Number((prev + target.pnl).toFixed(2)));
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleResetDemoAccount = () => {
    setAccountBalance(10000);
    setPositions([]);
  };

  // SVG Chart Geometry
  const chartHeight = 320;
  const chartWidth = 720;
  const candleCount = candles.length;
  const candleWidth = Math.max(6, (chartWidth - 60) / Math.max(1, candleCount));

  const getY = (val: number) => {
    const range = chartMinMax.max - chartMinMax.min;
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((val - chartMinMax.min) / range) * (chartHeight - 40) - 20;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Pair Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Live Chart & Execution Station
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Demo Sim
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Practice technical analysis concepts, indicator crossovers, and disciplined risk management in real time.
          </p>
        </div>

        {/* Pair Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quotes.map((q) => (
            <button
              key={q.symbol}
              id={`chart-pair-select-${q.symbol.replace('/', '-')}`}
              onClick={() => onSelectSymbol(q.symbol)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 ${
                selectedSymbol === q.symbol
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDarkMode
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {q.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chart Stage on Left, Order Ticket on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Candlestick Chart Stage (8 cols) */}
        <div className={`lg:col-span-8 rounded-3xl border p-5 flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Chart Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            
            {/* Asset Quote Info */}
            <div className="flex items-center gap-3">
              <div>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  {currentQuote.symbol}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {currentQuote.name}
                </div>
              </div>
              <div className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {candles.length > 0 ? candles[candles.length - 1].close.toFixed(currentQuote.digits) : currentQuote.price}
              </div>
            </div>

            {/* Timeframe Selectors */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              {(['1M', '5M', '15M', '1H', '1D'] as const).map((tf) => (
                <button
                  key={tf}
                  id={`tf-btn-${tf}`}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    timeframe === tf
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Live Ticking Pause / Play */}
            <button
              id="toggle-live-feed-btn"
              onClick={() => setIsLiveTicking(!isLiveTicking)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                isLiveTicking
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-300 dark:border-slate-700'
              }`}
            >
              {isLiveTicking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLiveTicking ? 'Live Feed' : 'Paused'}</span>
            </button>
          </div>

          {/* Indicator Toggles */}
          <div className="flex flex-wrap items-center gap-2 py-3 text-xs border-b border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">Indicators:</span>
            
            <button
              id="toggle-sma20-btn"
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-1 rounded-md font-medium border transition-colors ${
                showSMA20
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                  : 'border-transparent text-slate-400'
              }`}
            >
              SMA 20 (Blue)
            </button>

            <button
              id="toggle-sma50-btn"
              onClick={() => setShowSMA50(!showSMA50)}
              className={`px-2 py-1 rounded-md font-medium border transition-colors ${
                showSMA50
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'border-transparent text-slate-400'
              }`}
            >
              SMA 50 (Gold)
            </button>

            <button
              id="toggle-bollinger-btn"
              onClick={() => setShowBollinger(!showBollinger)}
              className={`px-2 py-1 rounded-md font-medium border transition-colors ${
                showBollinger
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                  : 'border-transparent text-slate-400'
              }`}
            >
              Bollinger Bands
            </button>

            <button
              id="toggle-rsi-btn"
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded-md font-medium border transition-colors ${
                showRSI
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'border-transparent text-slate-400'
              }`}
            >
              RSI Panel
            </button>
          </div>

          {/* OHLC Legend / Hover Info */}
          <div className="py-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3">
            {hoveredCandle ? (
              <>
                <span>Time: <strong>{hoveredCandle.time}</strong></span>
                <span>O: <strong>{hoveredCandle.open.toFixed(currentQuote.digits)}</strong></span>
                <span>H: <strong>{hoveredCandle.high.toFixed(currentQuote.digits)}</strong></span>
                <span>L: <strong>{hoveredCandle.low.toFixed(currentQuote.digits)}</strong></span>
                <span>C: <strong>{hoveredCandle.close.toFixed(currentQuote.digits)}</strong></span>
                <span>Vol: <strong>{hoveredCandle.volume}</strong></span>
                {hoveredCandle.rsi && <span>RSI: <strong>{hoveredCandle.rsi}</strong></span>}
              </>
            ) : candles.length > 0 ? (
              <>
                <span>Last: <strong>{candles[candles.length - 1].time}</strong></span>
                <span>O: <strong>{candles[candles.length - 1].open.toFixed(currentQuote.digits)}</strong></span>
                <span>H: <strong>{candles[candles.length - 1].high.toFixed(currentQuote.digits)}</strong></span>
                <span>L: <strong>{candles[candles.length - 1].low.toFixed(currentQuote.digits)}</strong></span>
                <span>C: <strong>{candles[candles.length - 1].close.toFixed(currentQuote.digits)}</strong></span>
              </>
            ) : null}
          </div>

          {/* Candlestick SVG Rendering Area */}
          <div className="relative w-full overflow-hidden my-2 select-none">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-72 sm:h-80 overflow-visible"
            >
              {/* Horizontal Grid lines */}
              {[0.2, 0.4, 0.6, 0.8].map((pct, idx) => {
                const y = chartHeight * pct;
                const priceVal = chartMinMax.max - pct * (chartMinMax.max - chartMinMax.min);
                return (
                  <g key={idx}>
                    <line
                      x1={0}
                      y1={y}
                      x2={chartWidth - 50}
                      y2={y}
                      stroke={isDarkMode ? '#334155' : '#e2e8f0'}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={chartWidth - 45}
                      y={y + 4}
                      fill={isDarkMode ? '#94a3b8' : '#64748b'}
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {priceVal.toFixed(currentQuote.digits)}
                    </text>
                  </g>
                );
              })}

              {/* Bollinger Bands Shaded Area */}
              {showBollinger && (
                <path
                  d={candles.map((c, i) => {
                    const x = i * candleWidth + candleWidth / 2;
                    const yUpper = getY(c.upperBand || c.high);
                    return `${i === 0 ? 'M' : 'L'} ${x} ${yUpper}`;
                  }).join(' ') + ' ' + candles.slice().reverse().map((c, i) => {
                    const origIdx = candles.length - 1 - i;
                    const x = origIdx * candleWidth + candleWidth / 2;
                    const yLower = getY(c.lowerBand || c.low);
                    return `L ${x} ${yLower}`;
                  }).join(' ') + ' Z'}
                  fill="rgba(168, 85, 247, 0.08)"
                  stroke="rgba(168, 85, 247, 0.4)"
                  strokeWidth="1"
                />
              )}

              {/* SMA 20 Line */}
              {showSMA20 && (
                <path
                  d={candles
                    .filter((c) => c.ma20 !== undefined)
                    .map((c, i) => {
                      const idx = candles.indexOf(c);
                      const x = idx * candleWidth + candleWidth / 2;
                      const y = getY(c.ma20!);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.8"
                />
              )}

              {/* SMA 50 Line */}
              {showSMA50 && (
                <path
                  d={candles
                    .filter((c) => c.ma50 !== undefined)
                    .map((c, i) => {
                      const idx = candles.indexOf(c);
                      const x = idx * candleWidth + candleWidth / 2;
                      const y = getY(c.ma50!);
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.8"
                />
              )}

              {/* Candlestick Bars */}
              {candles.map((candle, idx) => {
                const isBull = candle.close >= candle.open;
                const color = isBull ? '#10b981' : '#ef4444';
                const x = idx * candleWidth;
                const candleBodyWidth = Math.max(3, candleWidth - 3);

                const yHigh = getY(candle.high);
                const yLow = getY(candle.low);
                const yOpen = getY(candle.open);
                const yClose = getY(candle.close);

                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

                return (
                  <g
                    key={idx}
                    onMouseEnter={() => setHoveredCandle(candle)}
                    onMouseLeave={() => setHoveredCandle(null)}
                    className="cursor-crosshair"
                  >
                    {/* Wick */}
                    <line
                      x1={x + candleBodyWidth / 2}
                      y1={yHigh}
                      x2={x + candleBodyWidth / 2}
                      y2={yLow}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    {/* Candle Body */}
                    <rect
                      x={x}
                      y={bodyTop}
                      width={candleBodyWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* RSI Oscillator Sub-Panel */}
          {showRSI && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-500">RSI (14) Indicator:</span>
                <span className="text-emerald-500 font-mono">
                  {candles.length > 0 ? (candles[candles.length - 1].rsi || 50) : 50}
                </span>
              </div>
              <svg viewBox={`0 0 ${chartWidth} 60`} className="w-full h-14 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                {/* 70 Overbought and 30 Oversold horizontal guide lines */}
                <line x1={0} y1={18} x2={chartWidth} y2={18} stroke="#ef4444" strokeDasharray="2 2" opacity="0.6" />
                <line x1={0} y1={42} x2={chartWidth} y2={42} stroke="#10b981" strokeDasharray="2 2" opacity="0.6" />
                
                {/* RSI curve */}
                <path
                  d={candles.map((c, i) => {
                    const x = i * candleWidth + candleWidth / 2;
                    const rsiVal = c.rsi || 50;
                    const y = 60 - (rsiVal / 100) * 60;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Right Side: Demo Trading Account & Order Execution (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Account Overview Box */}
          <div className={`p-5 rounded-3xl border transition-colors ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Demo Trading Wallet
              </span>
              <button
                id="reset-demo-balance-btn"
                onClick={handleResetDemoAccount}
                className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-emerald-500 transition-colors"
                title="Reset account to $10,000"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">Balance</div>
                <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">Floating P/L</div>
                <div className={`text-lg font-black font-mono ${
                  totalFloatingPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {totalFloatingPnl >= 0 ? '+' : ''}${totalFloatingPnl.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Order Execution Form */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Place Market Order
              </div>

              {/* Lot Size */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Volume (Lots):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{lotSize} Lot</span>
                </div>
                <input
                  id="lot-size-slider"
                  type="range"
                  min="0.01"
                  max="2.00"
                  step="0.01"
                  value={lotSize}
                  onChange={(e) => setLotSize(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.01 (Micro)</span>
                  <span>0.10 (Mini)</span>
                  <span>1.00 (Standard)</span>
                </div>
              </div>

              {/* Stop Loss & Take Profit in Pips */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Stop Loss (Pips)</label>
                  <input
                    id="stop-loss-input"
                    type="number"
                    value={stopLossPips}
                    onChange={(e) => setStopLossPips(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full p-2 text-xs rounded-xl border font-mono outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">Take Profit (Pips)</label>
                  <input
                    id="take-profit-input"
                    type="number"
                    value={takeProfitPips}
                    onChange={(e) => setTakeProfitPips(Math.max(0, parseInt(e.target.value) || 0))}
                    className={`w-full p-2 text-xs rounded-xl border font-mono outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Order Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="execute-buy-btn"
                  onClick={() => handleExecuteTrade('BUY')}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>BUY / LONG</span>
                </button>
                <button
                  id="execute-sell-btn"
                  onClick={() => handleExecuteTrade('SELL')}
                  className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>SELL / SHORT</span>
                </button>
              </div>

              {orderMessage && (
                <div className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  orderMessage.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                }`}>
                  {orderMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{orderMessage.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Active Positions Table */}
          <div className={`p-5 rounded-3xl border transition-colors ${
            isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Open Positions ({positions.length})
              </span>
            </div>

            {positions.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {positions.map((pos) => (
                  <div
                    key={pos.id}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          pos.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                        }`}>
                          {pos.type}
                        </span>
                        <span>{pos.symbol}</span>
                        <span className="font-mono text-slate-400">({pos.lotSize}L)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Entry: {pos.entryPrice.toFixed(currentQuote.digits)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`font-mono font-bold ${pos.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <button
                        id={`close-pos-${pos.id}`}
                        onClick={() => handleClosePosition(pos.id)}
                        className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-slate-300 text-[10px] font-semibold transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-6">
                No active orders. Place a test trade above to simulate real market execution!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
