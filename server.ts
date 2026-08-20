import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get GoogleGenAI client
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Chat Assistant endpoint for Trading with Ludwe M
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], contextArticle } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGenAI();

      const systemInstruction = `You are the AI Trading Coach & Assistant for "Trading with Ludwe M" (Ludwe M Forex Trading Blog - ludwemhd.blogspot.com).
Your goal is to provide disciplined, educational, and actionable Forex trading guidance grounded in Ludwe M's core principles:
1. Technical Analysis: Price action, support & resistance, candlestick patterns (Hammers, Engulfing, Morning/Evening Stars, Doji), moving averages (50/200 MA), RSI (overbought >70, oversold <30), MACD, and chart patterns (Head & Shoulders, Double Top/Bottom).
2. Fundamental Analysis: Macroeconomic indicators (GDP, CPI inflation, Interest Rates, Central Bank statements, Non-Farm Payrolls) to determine directional bias.
3. Strict Risk Management: Never risk more than 1-2% per trade, always use stop losses, prioritize positive risk-to-reward (1:2 or higher), manage leverage prudently.
4. Mobile & Platform Setup: MetaTrader 4/5 and TradingView workflows on Android & iOS.
5. Trading Psychology: Patience, avoiding FOMO and revenge trading, continuous journaling.

Format your responses with clear markdown, bullet points, and practical examples. Always include a brief risk reminder when discussing specific trade setups.`;

      let prompt = message;
      if (contextArticle) {
        prompt = `[Context from article: "${contextArticle}"]\n\nUser Question: ${message}`;
      }

      if (!ai) {
        // Fallback intelligent response if API key is not configured
        const sampleResponses: Record<string, string> = {
          default: `**Trading with Ludwe M — Coach Insights:**\n\nTo navigate forex markets successfully, remember the core pillars taught by Ludwe M:\n\n1. **Identify the Trend:** Look for sequences of Higher Highs & Higher Lows (Uptrend) or Lower Lows & Lower Highs (Downtrend).\n2. **Find Key Levels:** Map out horizontal support & resistance zones where buyers and sellers clash.\n3. **Confirm with Candlesticks & Indicators:** Look for reversal patterns like Bullish/Bearish Engulfing or Hammers alongside RSI divergence.\n4. **Risk Rule #1:** Never risk more than 1% to 2% of your equity on any single setup. Always pre-calculate your lot size!`,
        };
        return res.json({
          reply: sampleResponses.default,
          isSimulated: true,
        });
      }

      let reply = '';
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        reply = response.text || '';
      } catch (genError) {
        console.warn('Primary model call error, attempting backup:', genError);
        // Fallback intelligent responses tailored to key trading queries
        const lowerQ = message.toLowerCase();
        if (lowerQ.includes('engulfing') || lowerQ.includes('candle') || lowerQ.includes('pattern')) {
          reply = `**Ludwe M Candlestick Guide:**\n\n- **Bullish Engulfing:** Occurs at the bottom of a downtrend when a green candle body completely covers the preceding red candle's body. Signals strong buyer dominance.\n- **Bearish Engulfing:** Occurs at the top of an uptrend when a large red candle overwhelms the previous green candle.\n- **Entry Rule:** Wait for the candle close to confirm the pattern. Place your Stop Loss just beyond the pattern's high/low.`;
        } else if (lowerQ.includes('risk') || lowerQ.includes('lot') || lowerQ.includes('stop loss') || lowerQ.includes('money')) {
          reply = `**Ludwe M Risk Management Rules:**\n\n1. **The 1-2% Rule:** Never risk more than 1% to 2% of your account balance on a single trade.\n2. **Calculate Lot Size First:** Use the formula \`Lot Size = (Balance × Risk %) / (Stop Loss Pips × Pip Value)\`.\n3. **Target 1:2 R:R Ratio:** Always aim for at least double your risk so you can remain profitable even with a 40-50% win rate.`;
        } else if (lowerQ.includes('metatrader') || lowerQ.includes('mt4') || lowerQ.includes('mt5') || lowerQ.includes('mobile') || lowerQ.includes('app')) {
          reply = `**Mobile Trading Setup (MT4/MT5 & TradingView):**\n\n1. Download MT4 or MT5 from the Google Play Store or Apple App Store.\n2. Search your broker and log in with your Demo or Live account credentials.\n3. Add major currency pairs (EUR/USD, GBP/USD, USD/JPY) to your Quotes list.\n4. Use TradingView for multi-timeframe charting and MT4/MT5 for executing calculated lot sizes.`;
        } else {
          reply = `**Trading with Ludwe M Coach Insights:**\n\nTo trade foreign exchange profitably, focus on these core tenets:\n\n1. **Multi-Timeframe Analysis:** Identify the macro trend on the 4H/Daily chart, then find key levels on the 1H/15M charts.\n2. **Support & Resistance:** Wait for price to reach key horizontal support/resistance zones before looking for candlestick triggers.\n3. **Disciplined Execution:** Never chase market impulses or enter without a pre-defined stop loss and take profit.`;
        }
      }

      return res.json({ reply, isSimulated: false });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({
        error: error.message || 'Failed to process AI chat request',
        reply: 'To trade profitably, focus on multi-timeframe price action, support and resistance mapping, and never risk more than 1-2% per trade.',
      });
    }
  });

  // Explain Concept endpoint
  app.post('/api/explain', async (req, res) => {
    try {
      const { concept, level = 'beginner' } = req.body;
      if (!concept) {
        return res.status(400).json({ error: 'Concept is required' });
      }

      const ai = getGenAI();
      if (!ai) {
        return res.json({
          explanation: `**${concept} (Overview)**\n\nIn Forex and financial markets, **${concept}** is a key trading principle. Technical and fundamental analysts use it to identify market conditions, control exposure, and find high-probability entry points. Always combine this with proper position sizing and stop loss placement!`,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Explain the Forex concept "${concept}" in a clear, concise, and highly practical way for a ${level} trader, following the educational philosophy of Ludwe M Forex Trading Blog. Highlight: 1) What it is, 2) Why it matters, 3) How to apply it on charts, 4) A concrete rule or example. Keep it under 250 words.`,
        config: {
          systemInstruction: 'You are an expert forex educator providing clean, crystal-clear trading explanations.',
        },
      });

      return res.json({
        explanation: response.text || `Explanation for ${concept}`,
      });
    } catch (error: any) {
      console.error('Error in /api/explain:', error);
      res.status(500).json({ error: error.message || 'Failed to explain concept' });
    }
  });

  // Setup Vite in Dev or Static in Production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Trading with Ludwe M] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
