import { currentWordId, userId } from '../pages/getWord.js';
import { API_BASE_URL } from '../../config.js';

export const generateFourAnswers = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/word/quiz-four/${userId}/${currentWordId}?direction=front-to-back`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return;
  }
};

export const generateFourAnswersInversion = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/word/quiz-four/${userId}/${currentWordId}?direction=back-to-front`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return;
  }
};
