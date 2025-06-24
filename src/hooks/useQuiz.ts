import { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, QuizResult, CategoryScore } from '../types/quiz';
import { loadQuestionsFromCSV } from '../utils/csvParser';

export const useQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showingFeedback, setShowingFeedback] = useState(false);

  // Load questions on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const loadedQuestions = await loadQuestionsFromCSV();
        if (loadedQuestions.length === 0) {
          throw new Error('No questions found in CSV file');
        }
        setQuestions(loadedQuestions);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion?.id);

  const handleAnswerSelect = useCallback((answer: 'A' | 'B' | 'C') => {
    if (!currentQuestion || showingFeedback) return;

    const isCorrect = answer === currentQuestion.correct_answer;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect
    };

    setUserAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });

    // Show feedback for 2.5 seconds, then auto-advance
    setShowingFeedback(true);
    setTimeout(() => {
      setShowingFeedback(false);
      // Auto-advance to next question or complete quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setIsQuizComplete(true);
      }
    }, 2500);
  }, [currentQuestion, showingFeedback, currentQuestionIndex, questions.length]);

  const goToNext = useCallback(() => {
    if (showingFeedback) return; // Prevent manual navigation during feedback
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
    }
  }, [currentQuestionIndex, questions.length, showingFeedback]);

  const goToPrevious = useCallback(() => {
    if (showingFeedback) return; // Prevent navigation during feedback
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex, showingFeedback]);

  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsQuizComplete(false);
    setShowingFeedback(false);
  }, []);

  const getQuizResult = useCallback((): QuizResult => {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Calculate category breakdown
    const categoryMap = new Map<string, { correct: number; total: number }>();
    
    questions.forEach(question => {
      const category = question.category;
      const userAnswer = userAnswers.find(a => a.questionId === question.id);
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { correct: 0, total: 0 });
      }
      
      const categoryData = categoryMap.get(category)!;
      categoryData.total++;
      
      if (userAnswer?.isCorrect) {
        categoryData.correct++;
      }
    });

    const categoryBreakdown: CategoryScore[] = Array.from(categoryMap.entries()).map(
      ([category, data]) => ({
        category,
        correct: data.correct,
        total: data.total,
        percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
      })
    );

    return {
      totalQuestions,
      correctAnswers,
      score,
      categoryBreakdown,
      answers: userAnswers
    };
  }, [questions, userAnswers]);

  const canGoNext = currentAnswer !== undefined && !showingFeedback;
  const canGoPrevious = currentQuestionIndex > 0 && !showingFeedback;
  const correctAnswersCount = userAnswers.filter(a => a.isCorrect).length;

  return {
    // State
    questions,
    currentQuestion,
    currentQuestionIndex,
    currentAnswer,
    userAnswers,
    isLoading,
    error,
    isQuizComplete,
    showingFeedback,
    
    // Navigation
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    
    // Actions
    handleAnswerSelect,
    restartQuiz,
    
    // Results
    getQuizResult,
    correctAnswersCount
  };
};