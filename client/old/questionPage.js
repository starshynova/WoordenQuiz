import {
  ANSWERS_LIST_ID,
  NAVIGATION_ID,
  USER_INTERFACE_ID,
} from "../constants.js";
import { createQuestionElement } from "../views/questionView.js";
import { createAnswerElement } from "../views/answerView.js";
import { quizData } from "../data.js";

import { initWelcomePage, userName } from "./welcomePage.js";

let skipQUestion = [];
let skipIndex;

export const initQuestionPage = () => {
  let currentQuestionIndex = 0;
  let correctAnswersCount = 0;

  const initQuestion = () => {
    const userInterface = document.getElementById(USER_INTERFACE_ID);
    userInterface.innerHTML = "";

    const currentQuestion = quizData[currentQuestionIndex];

    const questionElement = createQuestionElement(currentQuestion.questionText);
    userInterface.appendChild(questionElement);

    const answersListElement = document.createElement("div");
    answersListElement.id = ANSWERS_LIST_ID;
    answersListElement.innerHTML = "";

    const nextQuestionButton = document.createElement("button");
    nextQuestionButton.innerText = "Next Question";
    nextQuestionButton.classList.add("next-question-button");
    nextQuestionButton.disabled = true;
    nextQuestionButton.addEventListener("click", nextQuestion);

    if (currentQuestionIndex === quizData.length - 1) {
      nextQuestionButton.innerText = "Finish Quiz!";
    }

    const skipQuestionButton = document.createElement("button");
    skipQuestionButton.innerText = "Postpone Question";
    skipQuestionButton.classList.add("next-question-button");
    skipQuestionButton.addEventListener("click", nextQuestion);
    skipQuestionButton.addEventListener("click", addSkipQuestion);

    currentQuestion.answerText.forEach(([answerText, isCorrect]) => {
      const answerElement = createAnswerElement(answerText);
      answerElement.classList.add("answer-btn");
      answersListElement.appendChild(answerElement);

      answerElement.addEventListener("click", () => {
        document.querySelectorAll(".answer-btn").forEach((btn) => {
          btn.disabled = true;
        });

        if (isCorrect) {
          answerElement.classList.add("correct-answer");

          correctAnswersCount++;
        } else {
          answerElement.classList.add("incorrect-answer");

          const [correctAnswerText] = currentQuestion.answerText.find(
            ([, isCorrect]) => isCorrect,
          );

          const correctAnswerElement = Array.from(
            answersListElement.children,
          ).find((btn) => btn.innerText === correctAnswerText);

          if (correctAnswerElement) {
            correctAnswerElement.classList.add("correct-answer");
          }
        }

        nextQuestionButton.disabled = false;
      });
    });

    userInterface.appendChild(answersListElement);

    const navigationContainer = document.createElement("div");
    navigationContainer.id = NAVIGATION_ID;

    navigationContainer.innerHTML = "";

    navigationContainer.appendChild(skipQuestionButton);
    navigationContainer.appendChild(nextQuestionButton);

    userInterface.appendChild(navigationContainer);
  };

  const addSkipQuestion = () => {
    skipQUestion.push(currentQuestionIndex - 1);
  };

  const nextQuestion = () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
      initQuestion();
    } else if (skipQUestion.length === 0) {
      const userInterface = document.getElementById(USER_INTERFACE_ID);
      userInterface.innerHTML = "";

      const finalTextElement = document.createElement("h1");
      finalTextElement.textContent = `Dear ${userName}, your result is ${correctAnswersCount}/${quizData.length}!`;
      finalTextElement.style.color = "black";

      const goBackButton = document.createElement("button");
      goBackButton.classList.add("next-question-button");
      goBackButton.innerText = "Go Back";
      goBackButton.style.width = "30%";
      goBackButton.style.display = "flex";
      goBackButton.style.marginLeft = "auto";
      goBackButton.style.marginRight = "auto";
      goBackButton.style.alignItems = "center";
      goBackButton.style.justifyContent = "center";
      goBackButton.addEventListener("click", initWelcomePage);

      userInterface.appendChild(finalTextElement);
      userInterface.appendChild(goBackButton);
    } else {
      const userInterface = document.getElementById(USER_INTERFACE_ID);
      userInterface.innerHTML = "";
      const skipAnswerText = document.createElement("h1");
      skipAnswerText.textContent = `Dear ${userName}! You result is ${correctAnswersCount}/${quizData.length}!
    But you postponed answering ${skipQUestion.length + 1} questions. Would you like to try again to answer these questions?`;
      skipAnswerText.style.color = "black";
      userInterface.appendChild(skipAnswerText);

      const tryAgainButton = document.createElement("button");
      tryAgainButton.classList.add("next-question-button");
      tryAgainButton.innerText = "Answer Postponed Questions";
      tryAgainButton.addEventListener("click", tryAgainAnswer);

      const finishButton = document.createElement("button");
      finishButton.classList.add("next-question-button");
      finishButton.innerText = "Finish";
      finishButton.addEventListener("click", initWelcomePage);
      finishButton.addEventListener("click", zeroSkipQuestion);

      const navigationContainer = document.createElement("div");
      navigationContainer.id = NAVIGATION_ID;
      navigationContainer.innerHTML = "";
      navigationContainer.style.marginTop = "80px";
      navigationContainer.style.marginBottom = "40px";
      navigationContainer.appendChild(tryAgainButton);
      navigationContainer.appendChild(finishButton);
      userInterface.appendChild(navigationContainer);
    }
  };

  let zeroSkipQuestion = () => {
    skipQUestion.splice(0, skipQUestion.length);
  };

  const tryAgainAnswer = () => {
    skipIndex = 0;
    const initSkipQuestion = () => {
      const userInterface = document.getElementById(USER_INTERFACE_ID);
      userInterface.innerHTML = "";

      const currentQuestion = quizData[skipQUestion[skipIndex]];
      const questionElement = createQuestionElement(
        currentQuestion.questionText,
      );
      userInterface.appendChild(questionElement);

      const answersListElement = document.createElement("div");
      answersListElement.id = ANSWERS_LIST_ID;
      answersListElement.innerHTML = "";

      currentQuestion.answerText.forEach(([answerText, isCorrect]) => {
        const answerElement = createAnswerElement(answerText);
        answerElement.classList.add("answer-btn");
        answersListElement.appendChild(answerElement);

        answerElement.addEventListener("click", () => {
          document.querySelectorAll(".answer-btn").forEach((btn) => {
            btn.disabled = true;
          });

          if (isCorrect) {
            answerElement.classList.add("correct-answer");
            correctAnswersCount++;
          } else {
            answerElement.classList.add("incorrect-answer");

            const [correctAnswerText] = currentQuestion.answerText.find(
              ([, isCorrect]) => isCorrect,
            );

            const correctAnswerElement = Array.from(
              answersListElement.children,
            ).find((btn) => btn.innerText === correctAnswerText);

            if (correctAnswerElement) {
              correctAnswerElement.classList.add("correct-answer");
            }
          }

          nextQuestionButton.disabled = false;
        });
      });

      userInterface.appendChild(answersListElement);

      const nextQuestionButton = document.createElement("button");
      nextQuestionButton.innerText = "Next Postponed Question";
      nextQuestionButton.classList.add("next-question-button");
      nextQuestionButton.style.width = "30%";
      nextQuestionButton.style.display = "flex";
      nextQuestionButton.style.marginTop = "40px";
      nextQuestionButton.style.marginLeft = "auto";
      nextQuestionButton.style.marginRight = "auto";
      nextQuestionButton.style.alignItems = "center";
      nextQuestionButton.style.justifyContent = "center";
      nextQuestionButton.disabled = true;

      if (skipIndex === skipQUestion.length - 1) {
        nextQuestionButton.innerText = "Finish Quiz!";
      }

      nextQuestionButton.addEventListener("click", () => {
        skipIndex++;

        if (skipIndex < skipQUestion.length) {
          initSkipQuestion();
        } else {
          const userInterface = document.getElementById(USER_INTERFACE_ID);
          userInterface.innerHTML = "";
          const finalTextElement = document.createElement("h1");
          finalTextElement.textContent = `Dear ${userName}, your result is ${correctAnswersCount}/${quizData.length}!`;
          finalTextElement.style.color = "black";

          const goBackButton = document.createElement("button");
          goBackButton.classList.add("next-question-button");
          goBackButton.innerText = "Go Back";
          goBackButton.style.width = "30%";
          goBackButton.style.display = "flex";
          goBackButton.style.marginTop = "80px";
          goBackButton.style.marginLeft = "auto";
          goBackButton.style.marginRight = "auto";
          goBackButton.style.alignItems = "center";
          goBackButton.style.justifyContent = "center";
          goBackButton.addEventListener("click", initWelcomePage);
          goBackButton.addEventListener("click", zeroSkipQuestion);

          userInterface.appendChild(finalTextElement);
          userInterface.appendChild(goBackButton);
        }
      });

      userInterface.appendChild(nextQuestionButton);
    };

    initSkipQuestion();
  };

  initQuestion();
};

initQuestionPage();
