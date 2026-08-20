export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  readTime: string;
  category: 'Technical Analysis' | 'Market Strategy' | 'Platform Setup' | 'Beginners Guide' | 'Introduction';
  author: string;
  authorRole: string;
  coverImage?: string;
  images: string[];
  summary: string;
  keyTakeaways: string[];
  sections: {
    heading: string;
    level: 2 | 3;
    content: string;
  }[];
  contentHtml: string;
  plainText: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MarketQuote {
  symbol: string;
  name: string;
  category: 'Forex' | 'Commodity' | 'Crypto' | 'Index';
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  spread: number;
  pipDecimal: number;
  digits: number;
}

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
  ema200?: number;
  rsi?: number;
  upperBand?: number;
  lowerBand?: number;
}

export interface TradePosition {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  lotSize: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl: number;
  openTime: string;
}

export interface TechnicalPattern {
  id: string;
  name: string;
  type: 'Bullish' | 'Bearish' | 'Neutral / Reversal' | 'Continuation';
  category: 'Candlestick' | 'Chart Pattern';
  description: string;
  psychology: string;
  confirmation: string;
  tradingRule: string;
  visualType: 'hammer' | 'engulfing_bull' | 'engulfing_bear' | 'shooting_star' | 'morning_star' | 'evening_star' | 'doji' | 'double_bottom' | 'double_top' | 'head_and_shoulders';
}

export interface MarketSession {
  name: string;
  city: string;
  timezone: string;
  openUtc: number; // e.g. 8 for 08:00 UTC
  closeUtc: number; // e.g. 17 for 17:00 UTC
  openTime?: string;
  closeTime?: string;
  status: 'Open' | 'Closed';
  volatility: 'High' | 'Medium' | 'Low';
  dominantPairs: string[];
  pairs?: string[];
}

export type TradingSession = MarketSession;

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW';
  previous: string;
  forecast: string;
  actual?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswer?: number;
  explanation: string;
  sourceArticleId: string;
  articleId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  contextArticle?: string;
}

export type AiChatMessage = ChatMessage;

export interface UserProfile {
  userId: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkRecord {
  id: string;
  userId: string;
  articleId: string;
  articleTitle?: string;
  category?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize?: number;
  riskPercent?: number;
  outcome: 'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  completedArticles?: string[];
  quizHighestScore: number;
  quizTotalAttempts: number;
  lastActiveAt?: string;
  updatedAt: string;
}

