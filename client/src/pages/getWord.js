import { renderSingleCard } from "../views/flashCardView.js";
import { nextButton, nextWord } from "../views/nextWordButton.js";
import { finishSetButton } from "../views/finishSetButton.js";
import { renderQuizCard } from "../views/quizCardView.js";
import { message } from "../views/message.js";
import { nextWordSetPage } from "../views/nextWordSetButton.js";
import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm';


const token = localStorage.getItem("token");
if (!token) {
  message("You are not logged in. Please log in to continue.");
}

export let userId;
export let currentWordId;
export let currentStage;
export const stageCounters = {};
export let currentCounter;
let incorrectAnswer = false;
export const setIncorrectAnswer = (value) => {
  incorrectAnswer = value;
};
export let totalStageCount = 0;

export const getIncorrectAnswer = () => incorrectAnswer;

export const getWord = async () => {
  let word;
  try {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log("User ID:", userId);
    const response = await fetch(`http://localhost:3000/api/word/vocabulary/${userId}`);
    word = await response.json();
    console.log("User data:", word);
    currentWordId = word.word._id;
    currentStage = word.word.stage;
    totalStageCount = word.totalWordsWithStage; 
    currentCounter = word.word.counter;
    console.log("current counter:", currentCounter)
  } catch (error) {
    console.error("Error getting word:", error);
    return;
  }

  const stage = word.word.stage;
  setIncorrectAnswer(false);

  if ([0, 1].includes(stage)) {
    renderSingleCard(word.word.front, word.word.back);
  } else if (stage === 2) {
    renderSingleCard(word.word.back, word.word.front);
  } else if ([3, 4].includes(stage)) {
    renderQuizCard(2);
  } else if ([5, 6].includes(stage)) {
    renderQuizCard(4, 'front-to-back');
  } else if (stage === 7) {
    renderQuizCard(4, 'back-to-front');
  }

  if (currentStage < 3 && totalStageCount === 1) {
    nextButton.textContent = "Go to the next stage"; 
  } else if (currentStage < 3) {
    nextButton.textContent = "Next word";
  }
  if (currentStage > 2 && currentStage < 7 ) {
    nextButton.classList.remove("hide");
    nextButton.textContent = "Go to the next stage";
    if (totalStageCount !== 1) {
      nextButton.classList.add("hide");
    }
  }
  if (currentStage === 7 ) {
    nextButton.classList.remove("hide");
    nextButton.textContent = "Finish this set";
    nextButton.removeEventListener("click", nextWord);
    nextButton.addEventListener("click", nextWordSetPage);
    if (totalStageCount !== 1) {
      nextButton.classList.add("hide");
    }
  }
};

