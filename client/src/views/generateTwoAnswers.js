import { currentWordId } from "../pages/getWord.js";

export const generateTwoAnswers = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/word/quiz-two/${currentWordId}`,
    );
    const data = await response.json();
    console.log("Quiz 2 data:", data);
    return data;
  } catch (error) {
    console.error("Error generating quiz:", error);
    return;
  }
};
