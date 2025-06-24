import { Question } from '../types/quiz';

export const parseCSV = (csvText: string): Question[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    
    return {
      id: index + 1,
      question: values[0] || '',
      optionA: values[1] || '',
      optionB: values[2] || '',
      optionC: values[3] || '',
      correct_answer: (values[4] || 'A') as 'A' | 'B' | 'C',
      category: values[5] || 'General'
    };
  }).filter(q => q.question.trim() !== '');
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result.map(item => item.replace(/"/g, ''));
};

export const loadQuestionsFromCSV = async (): Promise<Question[]> => {
  try {
    const response = await fetch('/questions.csv');
    if (!response.ok) {
      throw new Error('Failed to load questions');
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
};