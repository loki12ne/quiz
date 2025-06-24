import React from 'react';
import { useQuiz } from './hooks/useQuiz';
import QuizHeader from './components/QuizHeader';
import QuestionCard from './components/QuestionCard';
import QuizNavigation from './components/QuizNavigation';
import QuizResults from './components/QuizResults';
import LoadingSpinner from './components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

function App() {
  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    currentAnswer,
    isLoading,
    error,
    isQuizComplete,
    canGoNext,
    canGoPrevious,
    showingFeedback,
    goToNext,
    goToPrevious,
    handleAnswerSelect,
    restartQuiz,
    getQuizResult,
    correctAnswersCount
  } = useQuiz();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure you have a "questions.csv" file in the public folder with the correct format.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isQuizComplete) {
    return <QuizResults result={getQuizResult()} onRestart={restartQuiz} />;
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">No questions available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <QuizHeader
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          score={correctAnswersCount}
          category={currentQuestion.category}
        />

        <QuestionCard
          question={currentQuestion}
          selectedAnswer={currentAnswer?.selectedAnswer || null}
          onAnswerSelect={handleAnswerSelect}
        />

        <QuizNavigation
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onRestart={restartQuiz}
          isQuizComplete={currentQuestionIndex === questions.length - 1 && canGoNext}
          showNextDelay={showingFeedback}
        />
      </div>
    </div>
  );
}

export default App;