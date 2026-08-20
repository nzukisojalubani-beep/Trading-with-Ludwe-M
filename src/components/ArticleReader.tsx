import React, { useState, useEffect, useRef } from 'react';
import { BlogPost } from '../types';
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Bot, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Type
} from 'lucide-react';

interface ArticleReaderProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onAskAiWithContext: (articleTitle: string, question?: string) => void;
  isDarkMode: boolean;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
  isBookmarked,
  onToggleBookmark,
  onAskAiWithContext,
  isDarkMode,
}) => {
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isCopied, setIsCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  
  // Audio Speech Synthesis state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Find next and previous posts
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Stop audio on post change
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const handleToggleAudio = () => {
    if (!synthRef.current) return;

    if (isPlayingAudio) {
      synthRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlayingAudio(true);
      } else {
        synthRef.current.cancel();
        // Prepare plain text for speech
        const speechText = `${post.title}. By ${post.author}. ${post.summary}. Key Takeaways: ${post.keyTakeaways.join('. ')}. ${post.sections.map(s => `${s.heading}. ${s.content}`).join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.rate = speechRate;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const handleRateChange = (rate: number) => {
    setSpeechRate(rate);
    if (isPlayingAudio && synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getTextClass = () => {
    switch (textSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'lg':
        return 'text-lg leading-relaxed';
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          id="reader-back-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        {/* Reader Controls */}
        <div className="flex items-center gap-2">
          {/* Text Size Control */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              id="text-size-sm-btn"
              onClick={() => setTextSize('sm')}
              className={`px-2 py-1 rounded font-medium ${textSize === 'sm' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
              title="Small text"
            >
              A-
            </button>
            <button
              id="text-size-base-btn"
              onClick={() => setTextSize('base')}
              className={`px-2 py-1 rounded font-medium ${textSize === 'base' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
              title="Normal text"
            >
              A
            </button>
            <button
              id="text-size-lg-btn"
              onClick={() => setTextSize('lg')}
              className={`px-2 py-1 rounded font-medium ${textSize === 'lg' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
              title="Large text"
            >
              A+
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            id="reader-bookmark-btn"
            onClick={() => onToggleBookmark(post.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title={isBookmarked ? 'Saved in bookmarks' : 'Save article'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Copy Link Share */}
          <button
            id="reader-share-btn"
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Copy share link"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Article Header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {post.category}
          </span>
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Level: {post.difficulty}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {post.subtitle}
          </p>
        )}

        {/* Author Bar */}
        <div className="flex items-center justify-between py-4 border-y border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              LM
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {post.author}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {post.authorRole} • Published on {post.date}
              </div>
            </div>
          </div>

          <a
            href="https://ludwemhd.blogspot.com/?m=1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <span>Original Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Audio Narration Bar */}
      <div className={`p-4 rounded-2xl border mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
        isPlayingAudio 
          ? 'bg-emerald-500/10 border-emerald-500/30' 
          : isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <button
            id="audio-play-pause-btn"
            onClick={handleToggleAudio}
            className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs hover:bg-emerald-700 transition-colors shrink-0"
            title={isPlayingAudio ? 'Pause Narration' : 'Listen to Article'}
          >
            {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span>{isPlayingAudio ? 'Playing Audio Narration...' : 'Listen to this Article'}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Browser text-to-speech audio reader
            </p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1 text-[11px]">Speed:</span>
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-2 py-1 rounded-md text-xs font-semibold ${
                speechRate === rate
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Hero Image if present */}
      {post.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-8 border border-slate-200 dark:border-slate-800 shadow-xs max-h-[420px] bg-slate-100 dark:bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Key Takeaways Callout */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <div className={`rounded-2xl p-6 mb-8 border ${
          isDarkMode
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : 'bg-emerald-50/60 border-emerald-200'
        }`}>
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-300 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Key Lesson Takeaways</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {post.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Body Content */}
      <div className={`space-y-8 text-slate-800 dark:text-slate-200 ${getTextClass()}`}>
        {post.sections.map((section, idx) => (
          <section key={idx} id={`section-${idx}`} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight pt-2">
              {section.heading}
            </h2>
            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {/* Additional article images if any */}
      {post.images && post.images.length > 1 && (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {post.images.slice(1).map((imgUrl, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <img
                src={imgUrl}
                alt={`${post.title} visual ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* AI Assistance Action Card */}
      <div className={`my-10 rounded-2xl p-6 border transition-colors ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 to-emerald-950/30 border-slate-800' 
          : 'bg-gradient-to-r from-slate-50 to-emerald-50/50 border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Have questions about this lesson?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask Ludwe M's AI Trading Coach for chart examples, explanations, and risk advice.
              </p>
            </div>
          </div>

          <button
            id="ask-ai-from-reader-btn"
            onClick={() => onAskAiWithContext(post.title, `Can you explain the key practical steps from "${post.title}"?`)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Coach</span>
          </button>
        </div>
      </div>

      {/* Next and Previous Lesson Navigation */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevPost ? (
          <button
            id="prev-article-btn"
            onClick={() => onSelectPost(prevPost)}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-colors ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-slate-400">Previous Lesson</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {prevPost.title}
              </div>
            </div>
          </button>
        ) : <div />}

        {nextPost && (
          <button
            id="next-article-btn"
            onClick={() => onSelectPost(nextPost)}
            className={`p-4 rounded-2xl border text-right flex items-center justify-end gap-3 transition-colors sm:ml-auto w-full ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="overflow-hidden text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Next Lesson</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {nextPost.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0" />
          </button>
        )}
      </div>
    </div>
  );
};
