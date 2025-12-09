import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
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
  // Dùng state này để lưu tạm đáp án vừa chọn nhằm hiển thị màu trong 0.5s chờ
  const [localSelection, setLocalSelection] = useState<'A' | 'B' | 'C' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const options = [
    { key: 'A' as const, text: question.optionA },
    { key: 'B' as const, text: question.optionB },
    { key: 'C' as const, text: question.optionC }
  ];

  // Play sound effect (Giữ lại âm thanh vì không phải visual effect, giúp nhận biết đúng sai nhanh)
  const playSound = (correct: boolean) => {
    try {
      const audio = new Audio();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (correct) {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const handleAnswerClick = (answer: 'A' | 'B' | 'C') => {
    if (showFeedback || showResult) return;
    
    const correct = answer === question.correct_answer;
    
    // 1. Cập nhật UI ngay lập tức
    setLocalSelection(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // 2. Phát âm thanh
    playSound(correct);
    
    // 3. Đợi 0.5 giây (500ms) rồi mới chuyển câu hỏi
    setTimeout(() => {
      onAnswerSelect(answer);
    }, 500);
  };

  // Reset feedback when question changes
  useEffect(() => {
    setShowFeedback(false);
    setIsCorrect(null);
    setLocalSelection(null);
  }, [question.id]);

  const getOptionStyle = (optionKey: 'A' | 'B' | 'C') => {
    // Ưu tiên sử dụng localSelection trong thời gian delay 0.5s
    const currentSelection = showResult ? selectedAnswer : localSelection;
    
    const isSelected = currentSelection === optionKey;
    const isCorrectAnswer = question.correct_answer === optionKey;
    
    // Logic hiển thị màu sắc
    if (showResult || showFeedback) {
      if (isCorrectAnswer) {
        // Màu xanh cho đáp án đúng
        return 'bg-green-100 border-green-500 text-green-900 font-medium';
      }
      if (isSelected && !isCorrectAnswer) {
        // Màu đỏ cho đáp án sai
        return 'bg-red-100 border-red-500 text-red-900';
      }
      // Các câu còn lại làm mờ đi
      return 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
    }
    
    // Trạng thái bình thường khi chưa chọn
    return 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm';
  };

  const getOptionIcon = (optionKey: 'A' | 'B' | 'C') => {
    if (!showResult && !showFeedback) return null;
    
    const currentSelection = showResult ? selectedAnswer : localSelection;
    const isCorrectAnswer = question.correct_answer === optionKey;
    const isSelected = currentSelection === optionKey;
    
    if (isCorrectAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (isSelected && !isCorrectAnswer) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 relative overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
            Câu {question.id}
          </span>
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
              {question.category}
            </span>
          </div>
        </div>
        <h2 className="text-lg font-medium text-gray-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleAnswerClick(option.key)}
            disabled={showResult || showFeedback}
            className={`w-full p-4 border rounded-lg text-left transition-colors duration-200 flex items-center justify-between ${getOptionStyle(option.key)} ${
              showFeedback || showResult ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                (showResult || showFeedback) && option.key === question.correct_answer
                  ? 'bg-green-200 border-green-600 text-green-800'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {option.key}
              </span>
              <span className="text-sm">{option.text}</span>
            </div>
            {getOptionIcon(option.key)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
