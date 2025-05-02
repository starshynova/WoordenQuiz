import { currentWordId, userId } from '../pages/getWord.js';
import { API_BASE_URL } from '../../config.js';

export const generateTwoAnswers = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/word/quiz-two/${userId}/${currentWordId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return;
  }
};
