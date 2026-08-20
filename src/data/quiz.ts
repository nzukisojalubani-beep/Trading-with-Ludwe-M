import { QuizQuestion } from '../types';

export const TRADING_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'According to the core principles of Technical Analysis, which of the following statements is true?',
    options: [
      'Market price action discounts all known fundamentals, news, and psychology.',
      'Prices always move in completely unpredictable and random trajectories.',
      'Historical price action has zero correlation with future behavior.',
      'Technical analysis is only valid for quarterly corporate earnings reports.'
    ],
    correctIndex: 0,
    explanation: 'A foundational axiom of technical analysis is that the current market price reflects and "discounts" all available information, including macroeconomic data and market sentiment.',
    sourceArticleId: 'technical-analysis'
  },
  {
    id: 2,
    question: 'In technical analysis, how is a confirmed Uptrend structurally identified?',
    options: [
      'By a continuous sequence of Lower Lows and Lower Highs.',
      'By a persistent series of Higher Highs (HH) and Higher Lows (HL).',
      'By the RSI staying pinned exactly at the 50 level.',
      'By price remaining flat between two horizontal levels.'
    ],
    correctIndex: 1,
    explanation: 'An Uptrend is structurally defined by price printing higher swing highs accompanied by higher swing lows over time.',
    sourceArticleId: 'technical-analysis'
  },
  {
    id: 3,
    question: 'What is the primary difference between Technical and Fundamental Analysis?',
    options: [
      'Technical analysis studies price charts and volume, while Fundamental analysis evaluates economic indicators, interest rates, and financial health.',
      'Fundamental analysis is used only for intraday 1-minute scalping.',
      'Technical analysis requires central bank speeches to execute trades.',
      'There is no functional difference between the two.'
    ],
    correctIndex: 0,
    explanation: 'Fundamental analysis determines an asset\'s intrinsic economic value and long-term bias, whereas technical analysis uses price history to determine optimal entry/exit timing.',
    sourceArticleId: 'technical-vs-fundamental'
  },
  {
    id: 4,
    question: 'In the EUR/USD currency pair, what does EUR represent and what is 1 pip in standard quotation?',
    options: [
      'EUR is the Quote currency, and 1 pip is 0.01.',
      'EUR is the Base currency, and 1 pip is typically 0.0001 (the 4th decimal place).',
      'EUR is the Derivative currency, and 1 pip is 1.00.',
      'USD is the Base currency, and 1 pip is 0.00001.'
    ],
    correctIndex: 1,
    explanation: 'In EUR/USD, the first currency (EUR) is the Base currency, and the second (USD) is the Quote currency. For standard pairs, 1 pip equals 0.0001.',
    sourceArticleId: 'beginners-trading'
  },
  {
    id: 5,
    question: 'What is the golden risk management rule advocated by professional traders like Ludwe M?',
    options: [
      'Risk 50% of account equity on high-conviction trades.',
      'Never place a stop loss so the trade has room to recover.',
      'Risk no more than 1% to 2% of total account capital on any single trade setup.',
      'Always use maximum 1:1000 leverage to grow accounts fast.'
    ],
    correctIndex: 2,
    explanation: 'Strictly limiting risk to 1%–2% per trade ensures you can endure consecutive drawdown periods without jeopardizing your trading capital.',
    sourceArticleId: 'technical-analysis'
  },
  {
    id: 6,
    question: 'When configuring MetaTrader (MT4/MT5) or TradingView on mobile, what is essential before trading live?',
    options: [
      'Practice on a Demo account, verify broker credentials, and test risk calculation tools.',
      'Immediately fund with borrowed money.',
      'Disable all chart indicators and stop losses.',
      'Only trade on public unverified Wi-Fi without passwords.'
    ],
    correctIndex: 0,
    explanation: 'Before risking live capital, familiarize yourself with order execution, test your strategy in demo environments, and verify broker connection security.',
    sourceArticleId: 'installing-trading-apps'
  }
];

export const QUIZ_QUESTIONS = TRADING_QUIZ_QUESTIONS.map((q) => ({
  ...q,
  correctAnswer: q.correctIndex,
  articleId: q.sourceArticleId,
}));
