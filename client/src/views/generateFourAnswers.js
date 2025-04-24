import { currentWordId } from "../pages/getWord.js";

export const generateFourAnswers = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/word/quiz-four/${currentWordId}?direction=front-to-back`,
    );
    const data = await response.json();
    console.log("Quiz 4 data:", data);
    return data;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return;
  }
};

export const generateFourAnswersInversion = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/word/quiz-four/${currentWordId}?direction=back-to-front`,
    );
    const data = await response.json();
    console.log("Quiz 4 data:", data);
    return data;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return;
  }
};
