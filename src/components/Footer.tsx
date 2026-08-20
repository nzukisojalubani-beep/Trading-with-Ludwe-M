import React from 'react';
import { TrendingUp, ShieldAlert, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, isDarkMode }) => {
  return (
    <footer className={`border-t mt-16 transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] border-white/10 text-white/60' : 'bg-slate-50 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? 'bg-white text-black' : 'bg-slate-900 text-white'
              }`}>
                <div className={`w-3.5 h-3.5 rotate-45 ${isDarkMode ? 'bg-black' : 'bg-white'}`}></div>
              </div>
              <span className="font-bold uppercase tracking-tight text-white dark:text-white text-slate-900 text-base">
                Trading with Ludwe M
              </span>
            </div>
            <p className="text-xs text-white/50 dark:text-white/50 text-slate-500 leading-relaxed max-w-md font-mono">
              A comprehensive educational platform grounded in real market experience by Ludwe M. Dedicated to transforming aspiring traders into disciplined market operators through price action and sound risk management.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs font-mono">
              <a
                href="https://ludwemhd.blogspot.com/?m=1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold"
              >
                <span>Original Blog: ludwemhd.blogspot.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Learning Links */}
          <div className="space-y-3 text-xs font-mono">
            <div className="font-bold text-white dark:text-white text-slate-900 uppercase tracking-widest text-[10px]">
              Platform Modules
            </div>
            <ul className="space-y-2 uppercase tracking-wider text-[11px]">
              <li>
                <button onClick={() => onSelectTab('articles')} className="hover:text-orange-400 transition-colors">
                  Lessons & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('charts')} className="hover:text-orange-400 transition-colors">
                  Interactive Live Sim
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('calculators')} className="hover:text-orange-400 transition-colors">
                  Position Size Tool
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('patterns')} className="hover:text-orange-400 transition-colors">
                  Candlestick Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sessions')} className="hover:text-orange-400 transition-colors">
                  Market Sessions Clock
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('quiz')} className="hover:text-orange-400 transition-colors">
                  Skill Assessment
                </button>
              </li>
            </ul>
          </div>

          {/* Author Profile Bento */}
          <div className="space-y-3">
            <div className="font-bold text-white dark:text-white text-slate-900 uppercase tracking-widest text-[10px] font-mono">
              Author Profile
            </div>
            <div className={`p-5 rounded-[24px] border ${
              isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center text-black font-bold text-xs">
                  LM
                </div>
                <div>
                  <div className="font-bold text-xs uppercase tracking-tight text-white dark:text-white text-slate-900">Ludwe M</div>
                  <div className="text-[10px] font-mono text-orange-400 uppercase tracking-widest">Forex Educator</div>
                </div>
              </div>
              <p className="text-[11px] text-white/50 dark:text-white/50 text-slate-500 leading-relaxed font-mono">
                Specializes in Price Action, Support/Resistance zones, and disciplined portfolio risk control.
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Educational Risk Disclaimer */}
        <div className={`p-5 rounded-[24px] border text-xs leading-relaxed flex items-start gap-3 ${
          isDarkMode ? 'bg-[#141414] border-white/5 text-white/50 font-mono text-[11px]' : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}>
          <ShieldAlert className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white dark:text-white text-slate-900 uppercase tracking-wider">High-Risk Warning:</strong> Foreign Exchange (Forex) and CFD trading carries a high level of risk to your capital and may not be suitable for all investors. All content on "Trading with Ludwe M" is strictly educational and not financial advice. Always practice on demo accounts and never risk funds you cannot afford to lose.
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/10 dark:border-white/10 border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/40 gap-2">
          <div>
            © {new Date().getFullYear()} TRADING WITH LUDWE M. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-1 uppercase tracking-widest text-[10px]">
            <span>BENTO GRID EDITION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
