import React, { useState, useMemo } from 'react';
import { BlogPost } from '../types';
import { ArticleCard } from './ArticleCard';
import { BookOpen, Search, Sparkles, TrendingUp, Compass, Award, ExternalLink, ArrowRight, Layers, ShieldCheck, Zap, Activity } from 'lucide-react';

interface ArticleListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  bookmarks: string[];
  onToggleBookmark: (postId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenCalculators: () => void;
  onOpenLiveChart: () => void;
  onOpenQuiz: () => void;
  isDarkMode: boolean;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  posts,
  onSelectPost,
  bookmarks,
  onToggleBookmark,
  searchQuery,
  setSearchQuery,
  onOpenCalculators,
  onOpenLiveChart,
  onOpenQuiz,
  isDarkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = ['All', 'Technical Analysis', 'Market Strategy', 'Platform Setup', 'Beginners Guide', 'Introduction'];
  const difficulties = ['All', 'Beginner', 'Intermediate'];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'All' || post.difficulty === selectedDifficulty;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.plainText.toLowerCase().includes(q);

      return matchCategory && matchDifficulty && matchSearch;
    });
  }, [posts, selectedCategory, selectedDifficulty, searchQuery]);

  const featuredPost = posts[0] || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* PRIMARY BENTO GRID SHOWCASE */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* TILE 1: Large Featured Masterclass (2 cols, 2 rows on lg) */}
        {featuredPost && (
          <div 
            id="bento-featured-tile"
            onClick={() => onSelectPost(featuredPost)}
            className={`md:col-span-2 lg:col-span-2 lg:row-span-2 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between group cursor-pointer transition-all duration-300 relative overflow-hidden border ${
              isDarkMode 
                ? 'bg-[#141414] border-white/5 hover:border-white/20 text-[#F0F0F0] shadow-2xl' 
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
            }`}
          >
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  01 // FEATURED CORNERSTONE
                </span>
                <span className="text-[11px] font-mono text-white/40 dark:text-white/40 text-slate-400">
                  {featuredPost.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-snug group-hover:text-orange-400 transition-colors">
                Deciphering Price Action: <span className="font-serif italic font-normal text-white/70 dark:text-white/70 text-slate-600">The Architecture of Clean Charts.</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/60 dark:text-white/60 text-slate-600 leading-relaxed line-clamp-3">
                {featuredPost.summary}
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 dark:border-white/5 border-slate-100 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center text-black font-bold text-xs">
                  LM
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">Ludwe M</div>
                  <div className="text-[10px] font-mono text-white/40 dark:text-white/40 text-slate-500 uppercase tracking-widest">
                    Forex Analyst & Author
                  </div>
                </div>
              </div>

              <button
                id="bento-read-featured-btn"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-transform group-hover:translate-x-1 ${
                  isDarkMode 
                    ? 'bg-white text-black font-bold hover:bg-slate-200' 
                    : 'bg-slate-900 text-white font-bold hover:bg-black'
                }`}
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TILE 2: Curriculum Index / Daily Lessons (1 col, 2 rows on lg) */}
        <div 
          id="bento-curriculum-tile"
          className={`lg:col-span-1 lg:row-span-2 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border transition-all ${
            isDarkMode 
              ? 'bg-[#141414] border-white/5 text-[#F0F0F0]' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 dark:text-white/40 text-slate-400">
                02 // CURRICULUM
              </span>
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            </div>

            <h3 className="text-base font-bold tracking-tight uppercase mb-4">
              Core Trading Modules
            </h3>

            <div className="space-y-3">
              {posts.slice(0, 4).map((post, idx) => (
                <div
                  key={post.id}
                  id={`bento-mini-lesson-${post.id}`}
                  onClick={() => onSelectPost(post)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                    isDarkMode 
                      ? 'bg-[#1A1A1A] border-white/5 hover:border-white/20' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/40 dark:text-white/40 text-slate-400 mb-1">
                    <span>MOD 0{idx + 1}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="text-xs font-semibold line-clamp-1 group-hover:text-orange-400 transition-colors">
                    {post.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 dark:border-white/5 border-slate-100 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>TOTAL MODULES: {posts.length}</span>
            <span className="text-orange-400 font-bold">100% FREE</span>
          </div>
        </div>

        {/* TILE 3: Golden Risk Rule Metric (1 col, 1 row) */}
        <div 
          id="bento-rule-metric-tile"
          className={`rounded-[32px] p-6 flex flex-col justify-between border transition-all ${
            isDarkMode 
              ? 'bg-[#1A1A1A] border-white/5 text-[#F0F0F0]' 
              : 'bg-slate-100 border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 dark:text-white/40 text-slate-400">
              03 // DISCIPLINE
            </span>
            <ShieldCheck className="w-4 h-4 text-orange-400" />
          </div>

          <div className="my-2">
            <div className="text-3xl font-black font-mono tracking-tight text-white dark:text-white text-slate-900">
              1:2 R:R
            </div>
            <p className="text-[11px] text-white/60 dark:text-white/60 text-slate-600 mt-1 leading-snug">
              Minimum risk-to-reward ratio enforced across all Ludwe M setups.
            </p>
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-orange-400 font-semibold">
            Max 1–2% Account Risk
          </div>
        </div>

        {/* TILE 4: Interactive Live Simulator Launcher (1 col, 1 row) - High Contrast Bento */}
        <div 
          id="bento-simulator-launch-tile"
          onClick={onOpenLiveChart}
          className="rounded-[32px] p-6 flex flex-col justify-between cursor-pointer transition-all bg-white text-black hover:bg-slate-100 shadow-xl group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-black/50">
              04 // PRACTICE
            </span>
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="my-1">
            <div className="text-base font-bold uppercase tracking-tight">
              Live Chart Simulator
            </div>
            <p className="text-[11px] text-black/70 mt-1 leading-snug">
              Simulate price action candles, RSI & MACD triggers in real-time.
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-black">
            <span>LAUNCH SIM</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* TILE 5: Risk & Position Sizing Engine (2 cols on md/lg, 1 row) */}
        <div 
          id="bento-calculator-tile"
          className={`md:col-span-2 lg:col-span-2 rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border transition-all ${
            isDarkMode 
              ? 'bg-[#141414] border-white/5 text-[#F0F0F0]' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                05 // POSITION SIZER
              </span>
              <span className="text-[10px] font-mono text-white/40">LOT SIZING ENGINE</span>
            </div>
            <h3 className="text-lg font-bold tracking-tight uppercase">
              Calculate Lot Sizes & Margin
            </h3>
            <p className="text-xs text-white/60 dark:text-white/60 text-slate-600 max-w-md leading-relaxed">
              Eliminate emotional sizing. Determine exact micro, mini, or standard lots based on stop loss pips.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              id="bento-open-calculator-btn"
              onClick={onOpenCalculators}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                isDarkMode
                  ? 'bg-[#1A1A1A] border-white/10 hover:bg-white/10 text-white'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              <span>Open Tool</span>
            </button>

            <button
              id="bento-open-quiz-btn"
              onClick={onOpenQuiz}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
                isDarkMode
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-black font-bold border-transparent hover:opacity-90'
                  : 'bg-slate-900 text-white border-transparent hover:bg-black'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Skill Quiz</span>
            </button>
          </div>
        </div>

        {/* TILE 6: Official Source Attribution Bento (1 col on md, 2 cols on lg, 1 row) */}
        <div 
          id="bento-source-tile"
          className={`md:col-span-1 lg:col-span-2 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border transition-all ${
            isDarkMode 
              ? 'bg-[#141414] border-white/5 text-[#F0F0F0]' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 dark:text-white/40 text-slate-400">
              06 // ARCHIVE
            </span>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </div>

          <div className="my-2">
            <div className="text-sm font-bold uppercase tracking-tight">
              Synced with ludwemhd.blogspot.com
            </div>
            <p className="text-xs text-white/60 dark:text-white/60 text-slate-600 mt-1">
              Curated from Ludwe M's official technical price action articles and market journals.
            </p>
          </div>

          <a
            id="bento-blogspot-link"
            href="https://ludwemhd.blogspot.com/?m=1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors"
          >
            <span>Visit Blogspot Portal</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </section>

      {/* LESSONS & ARTICLES ARCHIVE SECTION */}
      <section className="space-y-8 pt-4">
        
        {/* Section Header & Bento Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 dark:border-white/10 border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400">
                LESSON CATALOG
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">
              Educational Repository
            </h2>
            <p className="text-xs font-mono text-white/50 dark:text-white/50 text-slate-500 uppercase tracking-wider">
              Filter by topic or experience level ({filteredPosts.length} Guides Available)
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">LEVEL:</span>
            <div className={`flex items-center p-1 rounded-full border ${
              isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  id={`filter-diff-${diff.toLowerCase()}`}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                    selectedDifficulty === diff
                      ? isDarkMode 
                        ? 'bg-white text-black font-bold shadow-xs' 
                        : 'bg-slate-900 text-white font-bold shadow-xs'
                      : isDarkMode
                        ? 'text-white/60 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? isDarkMode
                    ? 'bg-white text-black font-bold border-white shadow-xs'
                    : 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                  : isDarkMode
                    ? 'bg-[#141414] border-white/5 text-white/60 hover:text-white hover:border-white/20'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Search Notification */}
        {searchQuery && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs font-mono text-orange-400">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>
                SHOWING RESULTS FOR: <strong>"{searchQuery.toUpperCase()}"</strong> ({filteredPosts.length} FOUND)
              </span>
            </div>
            <button
              id="clear-search-filter-btn"
              onClick={() => setSearchQuery('')}
              className="underline font-bold hover:text-orange-300"
            >
              CLEAR SEARCH
            </button>
          </div>
        )}

        {/* Bento Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <ArticleCard
                key={post.id}
                post={post}
                onSelect={onSelectPost}
                isBookmarked={bookmarks.includes(post.id)}
                onToggleBookmark={onToggleBookmark}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 px-6 rounded-[32px] border ${
            isDarkMode ? 'bg-[#141414] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <BookOpen className="w-12 h-12 mx-auto text-white/30 mb-4" />
            <h3 className="text-lg font-bold uppercase tracking-tight mb-2">
              No matching lessons found
            </h3>
            <p className="text-xs font-mono text-white/50 max-w-sm mx-auto mb-6 uppercase tracking-wider">
              Try adjusting your search terms or clearing selected category filters.
            </p>
            <button
              id="reset-filters-btn"
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-orange-500 text-black hover:bg-orange-400 transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
