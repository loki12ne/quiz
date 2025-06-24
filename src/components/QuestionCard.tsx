import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Volume2, ArrowRight } from 'lucide-react';
import { Question } from '../types/quiz';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: 'A' | 'B' | 'C' | null;
  onAnswerSelect: (answer: 'A' | 'B' | 'C') => void;
  showResult?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult = false
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(0);

  const options = [
    { key: 'A' as const, text: question.optionA },
    { key: 'B' as const, text: question.optionB },
    { key: 'C' as const, text: question.optionC }
  ];

  // Play sound effect
  const playSound = (correct: boolean) => {
    try {
      const audio = new Audio();
      if (correct) {
        // Create a simple success tone
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } else {
        // Create a simple error tone
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.2); // G3
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleAnswerClick = (answer: 'A' | 'B' | 'C') => {
    if (showFeedback || showResult) return;
    
    const correct = answer === question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setCountdown(3);
    
    // Play sound
    playSound(correct);
    
    // Call parent handler
    onAnswerSelect(answer);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Reset feedback when question changes
  useEffect(() => {
    setShowFeedback(false);
    setIsCorrect(null);
    setCountdown(0);
  }, [question.id]);

  const getOptionStyle = (optionKey: 'A' | 'B' | 'C') => {
    const isSelected = selectedAnswer === optionKey;
    const isCorrectAnswer = question.correct_answer === optionKey;
    
    if (showResult || showFeedback) {
      if (isCorrectAnswer) {
        return 'bg-green-50 border-green-500 text-green-800 transform scale-105 shadow-lg';
      }
      if (isSelected && !isCorrectAnswer) {
        return 'bg-red-50 border-red-500 text-red-800 transform scale-95';
      }
      return 'bg-gray-50 border-gray-200 text-gray-600';
    }
    
    if (isSelected) {
      return 'bg-blue-50 border-blue-500 text-blue-800 shadow-md';
    }
    
    return 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md hover:transform hover:scale-102';
  };

  const getOptionIcon = (optionKey: 'A' | 'B' | 'C') => {
    if (!showResult && !showFeedback) return null;
    
    const isCorrectAnswer = question.correct_answer === optionKey;
    const isSelected = selectedAnswer === optionKey;
    
    if (isCorrectAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />;
    }
    if (isSelected && !isCorrectAnswer) {
      return <XCircle className="w-5 h-5 text-red-500 animate-pulse" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
      {/* Feedback Animation Overlay */}
      {showFeedback && (
        <div className={`absolute inset-0 flex items-center justify-center z-10 ${
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        } bg-opacity-95 animate-pulse`}>
          <div className="text-center text-white">
            {isCorrect ? (
              <>
                <CheckCircle className="w-20 h-20 mx-auto mb-4 animate-bounce" />
                <h3 className="text-3xl font-bold mb-2">Correct! 🎉</h3>
                <p className="text-xl mb-4">Well done!</p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 mx-auto mb-4 animate-pulse" />
                <h3 className="text-3xl font-bold mb-2">Incorrect 😔</h3>
                <p className="text-xl mb-4">The correct answer is <strong>{question.correct_answer}</strong></p>
              </>
            )}
            
            {/* Auto-advance countdown */}
            <div className="flex items-center justify-center space-x-2 text-lg">
              <ArrowRight className="w-6 h-6 animate-pulse" />
              <span>Next question in {countdown}s</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Question {question.id}
          </span>
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {question.category}
            </span>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleAnswerClick(option.key)}
            disabled={showResult || showFeedback}
            className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-300 flex items-center justify-between ${getOptionStyle(option.key)} ${
              showFeedback || showResult ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="w-8 h-8 bg-white border-2 border-current rounded-full flex items-center justify-center font-semibold text-sm">
                {option.key}
              </span>
              <span className="font-medium">{option.text}</span>
            </div>
            {getOptionIcon(option.key)}
          </button>
        ))}
      </div>

      {/* Auto-advance notification */}
      {showFeedback && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <ArrowRight className="w-4 h-4 animate-pulse" />
            <span className="font-medium text-sm">Auto-advancing to next question...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;