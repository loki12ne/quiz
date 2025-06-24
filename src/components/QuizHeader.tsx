import React from 'react';
import { BookOpen, Target, Clock, Users } from 'lucide-react';

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  category?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  score,
  category
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">English Quiz</h1>
            <p className="text-gray-600">Test your knowledge</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-gray-700">Score: {score}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-gray-700">
              {currentQuestion}/{totalQuestions}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {category && (
          <div className="flex items-center space-x-2 mt-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-600 bg-orange-50 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHeader;