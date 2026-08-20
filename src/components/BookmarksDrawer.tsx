import React from 'react';
import { BlogPost } from '../types';
import { Bookmark, X, ArrowRight, Trash2, BookOpen } from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onRemoveBookmark: (postId: string) => void;
  onClearAll: () => void;
  isDarkMode: boolean;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedPosts,
  onSelectPost,
  onRemoveBookmark,
  onClearAll,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all ${
        isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-emerald-500 fill-current" />
            <h3 className="font-bold text-sm">Saved Lessons ({bookmarkedPosts.length})</h3>
          </div>
          <button
            id="close-bookmarks-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post) => (
              <div
                key={post.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {post.category}
                  </span>
                  <h4
                    onClick={() => {
                      onSelectPost(post);
                      onClose();
                    }}
                    className="font-bold text-xs mt-2 hover:text-emerald-500 cursor-pointer line-clamp-2"
                  >
                    {post.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <button
                    onClick={() => onRemoveBookmark(post.id)}
                    className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectPost(post);
                      onClose();
                    }}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]"
                  >
                    <span>Read Lesson</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs">No bookmarks saved yet. Click the bookmark icon on any guide to save it for quick reference.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {bookmarkedPosts.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onClearAll}
              className="w-full py-2 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
            >
              Clear All Bookmarks
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
