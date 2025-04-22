import { generateTwoAnswers } from "./generateTwoAnswers.js";
import { generateFourAnswers, generateFourAnswersInversion } from "./generateFourAnswers.js";
import { nextButton } from "./nextWordButton.js";
import { finishSetButton } from "./finishSetButton.js";
import { currentStage, setIncorrectAnswer, totalStageCount } from "../pages/getWord.js";

export const renderQuizCard = async (answerCount, direction = 'front-to-back') => {
  const container = document.createElement("div");
  container.className = `quiz-${answerCount}-container`;
  nextButton.disabled = true;

  const cardBlock = await createCardBlock(container, answerCount, direction);
  container.appendChild(cardBlock);
  container.appendChild(nextButton);
  if (answerCount === 4) {
    container.appendChild(finishSetButton);
  }

  document.getElementById("user-interface").appendChild(container);
};

const createCardBlock = async (container, answerCount, direction) => {
  const wrapper = document.createElement("div");
  wrapper.className = "card-block";

  let data;
  if (answerCount === 2) {
    data = await generateTwoAnswers();
  } else if (answerCount === 4) {
    if (direction === "front-to-back") {
      data = await generateFourAnswers();
    } else if (direction === "back-to-front") {
      data = await generateFourAnswersInversion();
    } else {
      console.error("Unknown direction:", direction);
      return;
    }
  }

  console.log("quizCard data:", data);

  const question = document.createElement("div");
  question.className = "question";
  question.textContent = data.question;
  container.appendChild(question);

  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-2-container";
  container.appendChild(answerContainer);

  const correctAnswer = data.correctAnswer;

  const createAnswerElement = (answerText) => {
    const element = document.createElement("button");
    element.classList.add("answer-btn");
    element.textContent = answerText;

    element.addEventListener("click", () => {
      document.querySelectorAll(".answer-btn").forEach((btn) => {
        btn.disabled = true;
      });

      if (answerText === correctAnswer) {
        element.classList.add("correct-answer");
      } else {
        element.classList.add("incorrect-answer");
        setIncorrectAnswer(true);

        const correctAnswerElement = Array.from(answerContainer.children).find(
          (btn) => btn.innerText === correctAnswer,
        );
        if (correctAnswerElement) {
          correctAnswerElement.classList.add("correct-answer");
        }
      }

      nextButton.disabled = false;

      if (currentStage === 7 && totalStageCount === 1) {
        finishSetButton.disabled = false;
      }
    });

    return element;
  };

  data.options.forEach((option) => {
    const answerElement = createAnswerElement(option);
    answerContainer.appendChild(answerElement);
  });

  return wrapper;
};
