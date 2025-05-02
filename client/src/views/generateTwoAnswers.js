import { currentWordId, userId } from '../pages/getWord.js';

export const generateTwoAnswers = async () => {
  try {
    const response = await fetch(
      `/api/word/quiz-two/${userId}/${currentWordId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return;
  }
};
