import { MarketQuote, MarketSession, EconomicEvent } from '../types';

export const INITIAL_MARKET_QUOTES: MarketQuote[] = [
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'Forex',
    price: 1.08425,
    change: 0.00182,
    changePercent: 0.17,
    high: 1.08650,
    low: 1.08110,
    spread: 0.8,
    pipDecimal: 4,
    digits: 5
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'Forex',
    price: 1.29180,
    change: -0.00240,
    changePercent: -0.19,
    high: 1.29550,
    low: 1.28920,
    spread: 1.1,
    pipDecimal: 4,
    digits: 5
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'Forex',
    price: 153.480,
    change: 0.650,
    changePercent: 0.43,
    high: 153.820,
    low: 152.610,
    spread: 1.0,
    pipDecimal: 2,
    digits: 3
  },
  {
    symbol: 'AUD/USD',
    name: 'Australian Dollar / US Dollar',
    category: 'Forex',
    price: 0.65820,
    change: 0.00110,
    changePercent: 0.17,
    high: 0.66010,
    low: 0.65630,
    spread: 1.2,
    pipDecimal: 4,
    digits: 5
  },
  {
    symbol: 'USD/CAD',
    name: 'US Dollar / Canadian Dollar',
    category: 'Forex',
    price: 1.38240,
    change: -0.00150,
    changePercent: -0.11,
    high: 1.38520,
    low: 1.38090,
    spread: 1.3,
    pipDecimal: 4,
    digits: 5
  },
  {
    symbol: 'USD/ZAR',
    name: 'US Dollar / South African Rand',
    category: 'Forex',
    price: 18.2450,
    change: 0.0820,
    changePercent: 0.45,
    high: 18.3600,
    low: 18.1500,
    spread: 25.0,
    pipDecimal: 4,
    digits: 4
  },
  {
    symbol: 'XAU/USD',
    name: 'Spot Gold / US Dollar',
    category: 'Commodity',
    price: 2684.50,
    change: 14.80,
    changePercent: 0.55,
    high: 2692.10,
    low: 2668.40,
    spread: 2.0,
    pipDecimal: 1,
    digits: 2
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin / US Dollar',
    category: 'Crypto',
    price: 94250.00,
    change: 1850.00,
    changePercent: 2.00,
    high: 95400.00,
    low: 92100.00,
    spread: 12.0,
    pipDecimal: 0,
    digits: 2
  }
];

export const MARKET_SESSIONS: MarketSession[] = [
  {
    name: 'London',
    city: 'London, UK (GMT)',
    timezone: 'UTC+0 / UTC+1',
    openUtc: 8,
    closeUtc: 16,
    status: 'Open',
    volatility: 'High',
    dominantPairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP', 'USD/CHF']
  },
  {
    name: 'New York',
    city: 'New York, USA (EST)',
    timezone: 'UTC-5 / UTC-4',
    openUtc: 13,
    closeUtc: 21,
    status: 'Open',
    volatility: 'High',
    dominantPairs: ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CAD', 'XAU/USD']
  },
  {
    name: 'Tokyo',
    city: 'Tokyo, Japan (JST)',
    timezone: 'UTC+9',
    openUtc: 0,
    closeUtc: 9,
    status: 'Closed',
    volatility: 'Medium',
    dominantPairs: ['USD/JPY', 'EUR/JPY', 'AUD/JPY', 'NZD/USD']
  },
  {
    name: 'Sydney',
    city: 'Sydney, Australia (AEST)',
    timezone: 'UTC+10',
    openUtc: 21,
    closeUtc: 6,
    status: 'Closed',
    volatility: 'Low',
    dominantPairs: ['AUD/USD', 'NZD/USD', 'AUD/NZD', 'AUD/JPY']
  }
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: '1',
    time: '13:30 UTC',
    currency: 'USD',
    event: 'US Core CPI Inflation (MoM / YoY)',
    impact: 'High',
    previous: '3.2%',
    forecast: '3.1%',
    actual: '3.0%'
  },
  {
    id: '2',
    time: '14:00 UTC',
    currency: 'USD',
    event: 'Federal Reserve FOMC Rate Decision & Press Conference',
    impact: 'High',
    previous: '5.25%',
    forecast: '5.00%',
    actual: '5.00%'
  },
  {
    id: '3',
    time: '09:00 UTC',
    currency: 'EUR',
    event: 'Eurozone ECB Monetary Policy Statement',
    impact: 'High',
    previous: '3.75%',
    forecast: '3.50%'
  },
  {
    id: '4',
    time: '07:00 UTC',
    currency: 'GBP',
    event: 'UK Gross Domestic Product (GDP) Prelim',
    impact: 'Medium',
    previous: '0.3%',
    forecast: '0.4%'
  },
  {
    id: '5',
    time: '13:30 UTC',
    currency: 'USD',
    event: 'US Non-Farm Payrolls (NFP) & Unemployment Rate',
    impact: 'High',
    previous: '142K',
    forecast: '150K'
  }
];

export const MARKET_QUOTES = INITIAL_MARKET_QUOTES;
export const TRADING_SESSIONS = MARKET_SESSIONS.map((s) => ({
  ...s,
  openTime: `${s.openUtc.toString().padStart(2, '0')}:00`,
  closeTime: `${s.closeUtc.toString().padStart(2, '0')}:00`,
  pairs: s.dominantPairs,
}));
