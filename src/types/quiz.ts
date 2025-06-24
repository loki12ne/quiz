export interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correct_answer: 'A' | 'B' | 'C';
  category: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: 'A' | 'B' | 'C';
  isCorrect: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  categoryBreakdown: CategoryScore[];
  answers: UserAnswer[];
}

export interface CategoryScore {
  category: string;
  correct: number;
  total: number;
  percentage: number;
}