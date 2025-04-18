import { generateTwoAnswers } from "./generateTwoAnswers.js";
import { nextButton } from "./nextWordButton.js";
import { setIncorrectAnswer } from "../pages/getWord.js";

export const renderQuizTwoCard = async () => {
  const container = document.createElement("div");
  container.className = "quiz-2-container";

  const cardBlock = await createCardBlock(container);
  container.appendChild(cardBlock);
  container.appendChild(nextButton);

  document.getElementById("user-interface").appendChild(container);
};

const createCardBlock = async (container) => {
  const wrapper = document.createElement("div");
  wrapper.className = "card-block";

  const data = await generateTwoAnswers();
  console.log("generateTwoAnswers:", data);

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
    });

    return element;
  };

  data.options.forEach((option) => {
    const answerElement = createAnswerElement(option);
    answerContainer.appendChild(answerElement);
  });

  return wrapper;
};
