import React from 'react';
import { BlogPost } from '../types';
import { Clock, Tag, Bookmark, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface ArticleCardProps {
  post: BlogPost;
  onSelect: (post: BlogPost) => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  searchHighlight?: string;
  isDarkMode: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  post,
  onSelect,
  isBookmarked,
  onToggleBookmark,
  isDarkMode,
}) => {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Technical Analysis':
        return isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Market Strategy':
        return isDarkMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Platform Setup':
        return isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Beginners Guide':
        return isDarkMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return isDarkMode ? 'bg-white/5 text-white/70 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <article
      id={`article-card-${post.id}`}
      className={`group flex flex-col justify-between rounded-[32px] border transition-all duration-300 overflow-hidden relative ${
        isDarkMode
          ? 'bg-[#141414] border-white/5 hover:border-white/20 text-[#F0F0F0] shadow-2xl'
          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-sm'
      }`}
    >
      <div>
        {/* Cover Image */}
        {post.coverImage && (
          <div 
            className="relative h-52 w-full overflow-hidden bg-[#1A1A1A] cursor-pointer" 
            onClick={() => onSelect(post)}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${getCategoryBadgeClass(post.category)}`}>
                {post.category}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 text-white/80 border border-white/10 backdrop-blur-md">
                {post.difficulty}
              </span>
            </div>
            
            <button
              id={`bookmark-btn-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(post.id);
              }}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                isBookmarked
                  ? 'bg-orange-500 text-black'
                  : 'bg-black/50 text-white/70 hover:text-white hover:bg-black/80 border border-white/10'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Lesson'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}

        {/* Card Body */}
        <div className="p-7">
          {!post.coverImage && (
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border ${getCategoryBadgeClass(post.category)}`}>
                {post.category}
              </span>
              <button
                id={`bookmark-btn-alt-${post.id}`}
                onClick={() => onToggleBookmark(post.id)}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-white/40 dark:text-white/40 text-slate-400 mb-3">
            <span>{post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>

          <h3 
            onClick={() => onSelect(post)}
            className="text-lg font-bold tracking-tight text-white dark:text-white text-slate-900 group-hover:text-orange-400 transition-colors line-clamp-2 cursor-pointer mb-3 leading-snug"
          >
            {post.title}
          </h3>

          <p className="text-xs text-white/60 dark:text-white/60 text-slate-600 line-clamp-3 leading-relaxed mb-5">
            {post.summary}
          </p>

          {/* Key Takeaways snippet preview */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className={`p-4 rounded-2xl mb-4 text-xs ${
              isDarkMode ? 'bg-[#1A1A1A] border border-white/5' : 'bg-slate-50 border border-slate-200/80'
            }`}>
              <div className="flex items-center gap-1.5 font-mono uppercase tracking-widest text-[10px] text-orange-400 mb-1">
                <Layers className="w-3 h-3" />
                <span>CORE PRINCIPLE:</span>
              </div>
              <p className="text-white/70 dark:text-white/70 text-slate-600 line-clamp-2 text-xs leading-relaxed">
                {post.keyTakeaways[0]}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 dark:bg-white/5 bg-slate-100 text-white/50 dark:text-white/50 text-slate-600 border border-white/5 dark:border-white/5 border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className={`px-7 py-4 border-t flex items-center justify-between transition-colors ${
        isDarkMode ? 'border-white/5 bg-[#161616]' : 'border-slate-100 bg-slate-50/80'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 flex items-center justify-center text-black font-bold text-xs">
            LM
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight text-white dark:text-white text-slate-800">
              {post.author}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 dark:text-white/40 text-slate-500">
              {post.authorRole}
            </div>
          </div>
        </div>

        <button
          id={`read-article-btn-${post.id}`}
          onClick={() => onSelect(post)}
          className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-orange-400 hover:text-orange-300 group-hover:translate-x-1 transition-all"
        >
          <span>READ LESSON</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
