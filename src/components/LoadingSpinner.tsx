import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Quiz...</h2>
        <p className="text-gray-500">Please wait while we prepare your questions</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;