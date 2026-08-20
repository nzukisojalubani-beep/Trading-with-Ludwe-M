import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BLOG_POSTS } from './data/posts';
import { MARKET_QUOTES } from './data/marketData';
import { BlogPost } from './types';
import { Navbar } from './components/Navbar';
import { MarketTicker } from './components/MarketTicker';
import { ArticleList } from './components/ArticleList';
import { ArticleReader } from './components/ArticleReader';
import { TradingViewSim } from './components/TradingViewSim';
import { TradeJournal } from './components/TradeJournal';
import { Calculators } from './components/Calculators';
import { PatternCheatsheet } from './components/PatternCheatsheet';
import { MarketSessions } from './components/MarketSessions';
import { TradingQuiz } from './components/TradingQuiz';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';

export function App() {
  const { bookmarks, toggleBookmark } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('articles');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChartSymbol, setSelectedChartSymbol] = useState<string>('EUR/USD');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('ludwe_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  // Drawers
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [aiContext, setAiContext] = useState<{ articleTitle?: string; defaultQuestion?: string } | undefined>(undefined);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ludwe_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ludwe_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleBookmark = (postId: string) => {
    const post = BLOG_POSTS.find((p) => p.id === postId);
    toggleBookmark(postId, post?.title, post?.category);
  };

  const handleClearAllBookmarks = () => {
    bookmarks.forEach((id) => {
      toggleBookmark(id);
    });
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToArticles = () => {
    setSelectedPost(null);
  };

  const handleOpenArticleById = (articleId: string) => {
    const post = BLOG_POSTS.find((p) => p.id === articleId);
    if (post) {
      setSelectedPost(post);
      setActiveTab('articles');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAskAiWithContext = (articleTitle: string, question?: string) => {
    setAiContext({ articleTitle, defaultQuestion: question });
    setIsAiCoachOpen(true);
  };

  const handleTickerSelect = (symbol: string) => {
    setSelectedChartSymbol(symbol);
    setActiveTab('charts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bookmarkedPosts = BLOG_POSTS.filter((p) => bookmarks.includes(p.id));

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={selectedPost ? 'articles' : activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedPost(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          if (q && selectedPost) setSelectedPost(null);
        }}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        bookmarkCount={bookmarks.length}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenAiCoach={() => {
          setAiContext(undefined);
          setIsAiCoachOpen(true);
        }}
      />

      {/* Real-time Ticker */}
      <MarketTicker
        quotes={MARKET_QUOTES}
        selectedSymbol={selectedChartSymbol}
        onSelectQuote={handleTickerSelect}
        isDarkMode={isDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            <motion.div
              key={`article-${selectedPost.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArticleReader
                post={selectedPost}
                allPosts={BLOG_POSTS}
                onBack={handleBackToArticles}
                onSelectPost={handleSelectPost}
                isBookmarked={bookmarks.includes(selectedPost.id)}
                onToggleBookmark={handleToggleBookmark}
                onAskAiWithContext={handleAskAiWithContext}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'articles' && (
                <ArticleList
                  posts={BLOG_POSTS}
                  onSelectPost={handleSelectPost}
                  bookmarks={bookmarks}
                  onToggleBookmark={handleToggleBookmark}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onOpenCalculators={() => setActiveTab('calculators')}
                  onOpenLiveChart={() => setActiveTab('charts')}
                  onOpenQuiz={() => setActiveTab('quiz')}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'charts' && (
                <TradingViewSim
                  quotes={MARKET_QUOTES}
                  selectedSymbol={selectedChartSymbol}
                  onSelectSymbol={setSelectedChartSymbol}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'journal' && (
                <TradeJournal
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'calculators' && (
                <Calculators
                  quotes={MARKET_QUOTES}
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'patterns' && (
                <PatternCheatsheet
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'sessions' && (
                <MarketSessions
                  isDarkMode={isDarkMode}
                />
              )}

              {activeTab === 'quiz' && (
                <TradingQuiz
                  onOpenArticleById={handleOpenArticleById}
                  isDarkMode={isDarkMode}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedPosts={bookmarkedPosts}
        onSelectPost={handleSelectPost}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearAllBookmarks}
        isDarkMode={isDarkMode}
      />

      {/* AI Trading Coach Drawer */}
      <AiCoachDrawer
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        initialContext={aiContext}
        isDarkMode={isDarkMode}
      />

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedPost(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;

