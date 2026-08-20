import { TechnicalPattern } from '../types';

export const TECHNICAL_PATTERNS: TechnicalPattern[] = [
  {
    id: 'bullish-engulfing',
    name: 'Bullish Engulfing',
    type: 'Bullish',
    category: 'Candlestick',
    description: 'A two-candle reversal pattern where a small bearish candle is completely engulfed by a large bullish candle with substantial volume.',
    psychology: 'Bears were in initial control, but intense buying pressure overwhelmed sellers, decisively shifting dominance to the bulls.',
    confirmation: 'Next candle closes above the high of the engulfing candle; ideally forms at an established support or key Fibonacci level.',
    tradingRule: 'Enter Long upon candle close or slight 50% retest; place Stop Loss below the swing low of the pattern.',
    visualType: 'engulfing_bull'
  },
  {
    id: 'bearish-engulfing',
    name: 'Bearish Engulfing',
    type: 'Bearish',
    category: 'Candlestick',
    description: 'A two-candle reversal pattern at the top of an uptrend where a small green candle is completely encompassed by a prominent red candle.',
    psychology: 'Bulls attempted to push higher, but aggressive institutional sellers entered, engulfing previous gains and signaling an impending downtrend.',
    confirmation: 'Bearish follow-through candle; formation coincides with major resistance or overbought RSI (>70).',
    tradingRule: 'Enter Short on the close of the engulfing candle; place Stop Loss above the pattern high.',
    visualType: 'engulfing_bear'
  },
  {
    id: 'hammer',
    name: 'Hammer (Pin Bar)',
    type: 'Bullish',
    category: 'Candlestick',
    description: 'A single candle pattern characterized by a small upper body and a long lower shadow (tail) that is at least twice the size of the body.',
    psychology: 'Sellers drove prices sharply lower during the session, but strong demand stepped in to reject the lows and push price back up near the open.',
    confirmation: 'A subsequent bullish candle confirming upward momentum; location at critical horizontal support.',
    tradingRule: 'Buy above the hammer high with Stop Loss placed strictly beneath the lowest point of the lower wick.',
    visualType: 'hammer'
  },
  {
    id: 'shooting-star',
    name: 'Shooting Star',
    type: 'Bearish',
    category: 'Candlestick',
    description: 'A bearish reversal candlestick with a small lower body, minimal lower wick, and a long upper shadow at least twice the length of the body.',
    psychology: 'Buyers pushed prices to a new high, but encountered overwhelming supply, forcing prices back down to close near the open.',
    confirmation: 'Subsequent bearish candle closing lower; rejection at ascending trendline or horizontal resistance.',
    tradingRule: 'Sell on break below shooting star body with Stop Loss just above the upper wick high.',
    visualType: 'shooting_star'
  },
  {
    id: 'morning-star',
    name: 'Morning Star',
    type: 'Bullish',
    category: 'Candlestick',
    description: 'A three-candle bullish reversal pattern consisting of a large bearish candle, a small indecision candle gapping lower, and a strong bullish candle.',
    psychology: 'Selling momentum decelerates into equilibrium and gives way to strong institutional accumulation.',
    confirmation: 'The third candle closes well into the body of the first bearish candle (typically > 50%).',
    tradingRule: 'Enter long on the close of the third candle with Stop Loss placed below the middle star low.',
    visualType: 'morning_star'
  },
  {
    id: 'evening-star',
    name: 'Evening Star',
    type: 'Bearish',
    category: 'Candlestick',
    description: 'A three-candle bearish reversal pattern occurring at market tops: a tall bullish candle, a small star candle, and a deep bearish closing candle.',
    psychology: 'Bullish exhaustion followed by decisive bearish order flow takeover.',
    confirmation: "Third candle closes deep into the first green candle's range with elevated volume.",
    tradingRule: "Enter short on third candle completion; Stop Loss set above the star's high.",
    visualType: 'evening_star'
  },
  {
    id: 'doji',
    name: 'Doji (Indecision)',
    type: 'Neutral / Reversal',
    category: 'Candlestick',
    description: 'A candle where open and close prices are virtually identical, manifesting as a cross or plus sign.',
    psychology: 'Complete equilibrium and transition between buyers and sellers. When appearing after a strong trend, it signals imminent trend fatigue.',
    confirmation: 'Directional breakout on the subsequent candle with volume expansion.',
    tradingRule: 'Wait for directional breakout beyond the Doji high or low before executing.',
    visualType: 'doji'
  },
  {
    id: 'double-bottom',
    name: 'Double Bottom (W Pattern)',
    type: 'Bullish',
    category: 'Chart Pattern',
    description: 'A classical chart pattern where price tests a support level twice with a moderate peak in between, forming a distinctive "W" shape.',
    psychology: 'Bears failed twice to break through key support, signaling robust buyer defense and exhausted downward momentum.',
    confirmation: 'A decisive candle close above the intervening neckline with volume expansion.',
    tradingRule: 'Enter on neckline breakout or pullback retest; target projected equal to the pattern height.',
    visualType: 'double_bottom'
  },
  {
    id: 'double-top',
    name: 'Double Top (M Pattern)',
    type: 'Bearish',
    category: 'Chart Pattern',
    description: 'A chart formation where price rallies to a resistance level twice and fails to break higher, outlining an "M" shape.',
    psychology: 'Buyers lacked the momentum to create a higher high, resulting in supply dominance and distribution.',
    confirmation: 'Break and close below the intervening support neckline.',
    tradingRule: 'Enter short upon neckline break with Stop Loss placed above the second peak.',
    visualType: 'double_top'
  },
  {
    id: 'head-and-shoulders',
    name: 'Head and Shoulders',
    type: 'Bearish',
    category: 'Chart Pattern',
    description: 'A premier reversal pattern consisting of a Left Shoulder, a higher Head, and a lower Right Shoulder connected by a common Neckline.',
    psychology: 'The transition from higher highs (uptrend) to a lower high (Right Shoulder) marks the structural shift from bullish to bearish order flow.',
    confirmation: 'Sustained break below the neckline with increased sell volume.',
    tradingRule: 'Enter short on neckline breakdown; measure distance from head to neckline to set minimum profit target.',
    visualType: 'head_and_shoulders'
  }
];
