import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Clock } from 'lucide-react';

interface QuizNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onRestart: () => void;
  isQuizComplete: boolean;
  showNextDelay?: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onRestart,
  isQuizComplete,
  showNextDelay = false
}) => {
  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
          canGoPrevious
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transform hover:scale-105'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Previous</span>
      </button>

      <div className="flex items-center space-x-4">
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all transform hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart</span>
        </button>
        
        {showNextDelay && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-full">
            <Clock className="w-4 h-4 animate-spin" />
            <span>Auto-advancing...</span>
          </div>
        )}
      </div>

      {/* Manual navigation is now optional since auto-advance is enabled */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
          canGoNext
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
      >
        <span>{isQuizComplete ? 'View Results' : 'Skip'}</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuizNavigation;