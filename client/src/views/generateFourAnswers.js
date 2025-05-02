import { currentWordId, userId } from '../pages/getWord.js';

export const generateFourAnswers = async () => {
  try {
    const response = await fetch(
      `/api/word/quiz-four/${userId}/${currentWordId}?direction=front-to-back`
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
      `/api/word/quiz-four/${userId}/${currentWordId}?direction=back-to-front`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return;
  }
};
