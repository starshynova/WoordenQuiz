import { renderSingleCard } from "../views/flashCardView.js";
import { nextButton } from "../views/nextWordButton.js";
import { finishSetButton } from "../views/finishSetButton.js";
import { renderQuizCard } from "../views/quizCardView.js";

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
    const response = await fetch("http://localhost:3000/api/word");
    word = await response.json();
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
  if (currentStage > 2 && currentStage < 7) {
    nextButton.textContent = "Go to the next stage";
    if (totalStageCount !==1) {
      nextButton.disabled = true;
    }
  }
if (currentStage === 7 && totalStageCount === 1) {
  nextButton.classList.add("hide");
  finishSetButton.classList.remove("hide");
  finishSetButton.classList.add("next-button");
}
};

