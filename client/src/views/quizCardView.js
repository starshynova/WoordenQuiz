import { generateTwoAnswers } from "./generateTwoAnswers.js";
import { generateFourAnswers, generateFourAnswersInversion } from "./generateFourAnswers.js";
import { nextButton } from "./nextWordButton.js";
import { finishSetButton } from "./finishSetButton.js";
import { currentStage, setIncorrectAnswer, totalStageCount } from "../pages/getWord.js";
import { nextWord } from "./nextWordButton.js";

export const renderQuizCard = async (answerCount, direction = 'front-to-back') => {
  document.getElementById("user-interface").innerHTML = "";
  const container = document.createElement("div");
  container.classList.add("container");
  const containerHeader = document.createElement("div");
  containerHeader.classList.add("container-header");
  if (currentStage === 3 || currentStage === 4) {
  containerHeader.textContent = `There is ${currentStage} stage. You have to choose one of two answers.`
  } else if (currentStage > 4 || currentStage < 8) {
    containerHeader.textContent = `There is ${currentStage} stage. You have to choose one of four answers.`
  }
  container.appendChild(containerHeader);
  // container.className = `quiz-${answerCount}-container`;
  // nextButton.disabled = true;
  nextButton.classList.add("hide");

  const cardBlock = await createCardBlock(container, answerCount, direction);
  container.appendChild(cardBlock);
  container.appendChild(nextButton);
  if (answerCount === 4) {
    // document.getElementById("user-interface").appendChild(finishSetButton);
    container.appendChild(finishSetButton);
  }

  document.getElementById("user-interface").appendChild(container);
  // document.getElementById("user-interface").appendChild(nextButton);
};

const createCardBlock = async (container, answerCount, direction) => {
  // const wrapper = document.createElement("div");
  
  // wrapper.className = "answer-block";

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

  const question = document.createElement("div");
  question.classList.add("question");
  question.textContent = data.question;
  container.appendChild(question);

  const answerContainer = document.createElement("div");
  answerContainer.className = "answer-block";
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
        if (totalStageCount !== 1) { 
          setTimeout(() => {
            nextWord();
          }, 500);
        }
      } else {
        element.classList.add("incorrect-answer");
        setIncorrectAnswer(true);
        

        const correctAnswerElement = Array.from(answerContainer.children).find(
          (btn) => btn.innerText === correctAnswer,
        );
        if (correctAnswerElement) {
          correctAnswerElement.classList.add("correct-answer");
        }
        if (totalStageCount !== 1) { 
        setTimeout(() => {
          nextWord();
        }, 500);
      }
      }
      if (totalStageCount === 1) {
        nextButton.classList.remove("hide");
      }

      // nextButton.disabled = false;

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

  return answerContainer;
};
