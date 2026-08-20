import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  LineChart, 
  Calculator, 
  Compass, 
  Clock, 
  HelpCircle, 
  Bot, 
  Bookmark, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ExternalLink,
  BookMarked,
  LogOut,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  bookmarkCount: number;
  onOpenBookmarks: () => void;
  onOpenAiCoach: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  bookmarkCount,
  onOpenBookmarks,
  onOpenAiCoach,
}) => {
  const { user, userProfile, signInWithGoogle, signOutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { id: 'articles', label: 'Guides & Articles', icon: BookOpen },
    { id: 'charts', label: 'Live Chart & Sim', icon: LineChart },
    { id: 'journal', label: 'Trade Journal', icon: BookMarked },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'patterns', label: 'Pattern Matrix', icon: Compass },
    { id: 'sessions', label: 'Market Clock', icon: Clock },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors ${
      isDarkMode 
        ? 'bg-[#0A0A0A]/95 border-white/10 text-[#F0F0F0] backdrop-blur-md' 
        : 'bg-white/95 border-slate-200/80 text-slate-900 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo - Bento Monogram */}
          <div 
            id="brand-logo"
            onClick={() => { setActiveTab('articles'); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm ${
              isDarkMode ? 'bg-white text-black' : 'bg-slate-900 text-white'
            }`}>
              <div className={`w-4 h-4 rotate-45 ${isDarkMode ? 'bg-black' : 'bg-white'}`}></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tighter uppercase">Trading with Ludwe M</span>
                <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border hidden sm:inline-block ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-orange-400' : 'bg-slate-100 border-slate-200 text-emerald-700'
                }`}>
                  Firebase Sync
                </span>
              </div>
              <p className="text-[10px] font-mono text-white/40 dark:text-white/40 text-slate-500 hidden md:block uppercase tracking-wider">
                Price Action & Market Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-white text-black font-bold shadow-xs'
                        : 'bg-slate-900 text-white font-bold shadow-xs'
                      : isDarkMode
                        ? 'text-white/60 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2">
            {/* Search Bar Input */}
            <div className="relative hidden xl:block w-44">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH LESSONS..."
                className={`w-full pl-8 pr-3 py-1.5 text-[11px] font-mono rounded-full border transition-colors outline-none focus:ring-1 focus:ring-orange-500 ${
                  isDarkMode
                    ? 'bg-[#141414] border-white/10 text-white placeholder-white/30'
                    : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/5 xl:hidden"
              aria-label="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Bookmarks Button */}
            <button
              id="bookmarks-toggle-btn"
              onClick={onOpenBookmarks}
              className={`relative p-2 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Saved Lessons"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-orange-500 text-black rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* AI Coach Button */}
            <button
              id="ai-coach-nav-btn"
              onClick={onOpenAiCoach}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-black font-bold border-transparent hover:opacity-90' 
                  : 'bg-slate-900 text-white border-transparent hover:bg-black'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Coach</span>
            </button>

            {/* Firebase Auth Button / User Profile */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`flex items-center gap-2 p-1 pl-2 rounded-full border transition-all ${
                    isDarkMode ? 'bg-[#141414] border-white/10 hover:border-white/30' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-mono uppercase font-bold text-orange-400 hidden sm:inline max-w-[80px] truncate">
                    {user.displayName?.split(' ')[0] || 'Trader'}
                  </span>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-orange-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 text-black font-bold text-xs flex items-center justify-center">
                      {user.displayName?.charAt(0) || 'T'}
                    </div>
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-2xl border p-3 shadow-2xl z-50 space-y-3 ${
                    isDarkMode ? 'bg-[#141414] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}>
                    <div className="border-b border-white/10 pb-2">
                      <div className="text-xs font-bold truncate">{user.displayName || 'Trader'}</div>
                      <div className="text-[10px] font-mono text-white/50 truncate">{user.email}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-mono uppercase text-emerald-400">
                          {userProfile?.experienceLevel || 'Beginner'} Trader
                        </span>
                      </div>
                    </div>

                    <button
                      id="view-journal-from-profile-btn"
                      onClick={() => {
                        setActiveTab('journal');
                        setIsProfileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors ${
                        isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-100'
                      }`}
                    >
                      <BookMarked className="w-3.5 h-3.5 text-orange-400" />
                      <span>Trade Journal</span>
                    </button>

                    <button
                      id="sign-out-btn"
                      onClick={() => {
                        signOutUser();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="google-sign-in-btn"
                onClick={signInWithGoogle}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                  isDarkMode 
                    ? 'bg-white text-black font-bold hover:bg-slate-200 border-white' 
                    : 'bg-slate-900 text-white font-bold hover:bg-black border-slate-900'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border transition-colors ${
                isDarkMode 
                  ? 'border-white/10 hover:bg-white/10 text-orange-400' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full lg:hidden text-white/70 hover:bg-white/10"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="pb-3 xl:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH LESSONS..."
                className={`w-full pl-9 pr-3 py-2 text-xs font-mono rounded-full border outline-none ${
                  isDarkMode
                    ? 'bg-[#141414] border-white/10 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-t px-4 py-4 space-y-2 ${
          isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-colors ${
                  isActive
                    ? isDarkMode
                      ? 'bg-white text-black font-bold'
                      : 'bg-slate-900 text-white font-bold'
                    : isDarkMode
                      ? 'text-white/70 hover:bg-white/5'
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 text-orange-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
            <a 
              href="https://ludwemhd.blogspot.com/?m=1" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-orange-400"
            >
              <span>Original Blogspot</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>By Ludwe M</span>
          </div>
        </div>
      )}
    </header>
  );
};

