import React from 'react';
import { Trophy, Target, BarChart3, RefreshCw } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onRestart: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, onRestart }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Excellent! Outstanding performance! 🌟';
    if (score >= 80) return 'Great job! Well done! 👏';
    if (score >= 70) return 'Good work! Keep it up! 👍';
    if (score >= 60) return 'Not bad! Room for improvement. 💪';
    return 'Keep practicing! You can do better! 📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">Here are your results</p>
        </div>

        {/* Score Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
              {result.score}%
            </div>
            <p className="text-xl text-gray-700 font-medium">
              {getScoreMessage(result.score)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{result.correctAnswers}</div>
              <div className="text-sm text-blue-800">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{result.totalQuestions}</div>
              <div className="text-sm text-purple-800">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {result.totalQuestions - result.correctAnswers}
              </div>
              <div className="text-sm text-green-800">Incorrect</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h2>
          <div className="space-y-4">
            {result.categoryBreakdown.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-700">{category.category}</h3>
                  <span className={`font-bold ${getScoreColor(category.percentage)}`}>
                    {category.percentage}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{category.correct} / {category.total} correct</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Take Quiz Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;