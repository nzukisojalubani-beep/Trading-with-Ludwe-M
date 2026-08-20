import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { QuizQuestion } from '../types';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


interface TradingQuizProps {
  onOpenArticleById: (articleId: string) => void;
  isDarkMode: boolean;
}

export const TradingQuiz: React.FC<TradingQuizProps> = ({ onOpenArticleById, isDarkMode }) => {
  const { user, userProgress, saveQuizScore } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      const finalScore = selectedOption === currentQuestion.correctAnswer ? score + 1 : score;
      const scorePercent = Math.round((finalScore / QUIZ_QUESTIONS.length) * 100);
      saveQuizScore(scorePercent);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Trading Knowledge & Strategy Quiz
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Test your comprehension of technical patterns, risk controls, and market concepts from Ludwe M's blog.
          </p>
        </div>

        {user && userProgress && (
          <div className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono shrink-0">
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider">FIRESTORE RECORD</div>
            <div className="font-bold text-slate-900 dark:text-white">High Score: {userProgress.quizHighestScore}%</div>
            <div className="text-[10px] text-slate-500">{userProgress.quizTotalAttempts} attempts logged</div>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {/* Progress Bar & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Question <strong>{currentIndex + 1}</strong> of <strong>{QUIZ_QUESTIONS.length}</strong>
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Current Score: {score}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;

              let optionStyle = isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300';

              if (isSelected) {
                optionStyle = 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
              }

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300 font-semibold';
                }
              }

              return (
                <button
                  key={idx}
                  id={`quiz-option-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left text-sm flex items-center justify-between transition-all ${optionStyle}`}
                >
                  <span>{option}</span>
                  {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box on Answer Submission */}
          {isAnswerSubmitted && (
            <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
              selectedOption === currentQuestion.correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Explanation:</span>
              </div>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>

              {currentQuestion.articleId && (
                <button
                  id="quiz-read-source-lesson-btn"
                  onClick={() => onOpenArticleById(currentQuestion.articleId!)}
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:underline pt-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Review lesson in source guide</span>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end pt-2">
            {!isAnswerSubmitted ? (
              <button
                id="submit-quiz-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  selectedOption !== null
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <button
                id="next-quiz-question-btn"
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completion View */
        <div className={`p-8 sm:p-12 rounded-3xl border text-center space-y-6 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You scored <strong>{score}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong> ({Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            {score === QUIZ_QUESTIONS.length
              ? 'Outstanding performance! You have mastered the foundational trading principles of Ludwe M.'
              : score >= 4
              ? 'Great effort! You understand the key risk and technical principles.'
              : 'Keep studying the lessons! Review the candlestick and risk management articles to sharpen your edge.'}
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <button
              id="restart-quiz-btn"
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

