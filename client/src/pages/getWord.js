import { renderSingleCard } from "../views/flashCardView.js";
import { renderQuizTwoCard } from "../views/quizTwoCardView.js";
import { renderQuizFourCard } from "../views/quizFourCardView.js";
import { nextButton } from "../views/nextWordButton.js";
// import {nextWordSetButton} from "../views/nextWordSetButton.js";
import { finishSetButton } from "../views/finishSetButton.js";

export let currentWordId;
export let currentStage = 0;
export const stageCounters = {};
export let currentCounter = 0;
let incorrectAnswer = false;
export const setIncorrectAnswer = (value) => {
  incorrectAnswer = value;
};
export let totalStageCount = 0;

export const getIncorrectAnswer = () => incorrectAnswer;

export const getWord = async () => {
  let word;
  
  const incrementStageCounter = (stage) => {
    if (!stageCounters[stage]) {
      stageCounters[stage] = 1;
    } else {
      stageCounters[stage]++;
      console.log(stageCounters);
    }
  };
  
  try {
    const response = await fetch("http://localhost:3000/api/word");
    word = await response.json();
    currentWordId = word.word._id;
    currentStage = word.word.stage;
    totalStageCount = word.totalWordsWithStage; 
    currentCounter = word.word.counter;
  } catch (error) {
    console.error("Error getting word:", error);
    return;
  }

  console.log("Word:", word);
  const stage = word.word.stage;
  setIncorrectAnswer(false);

  if ([0, 1].includes(stage)) {
    renderSingleCard(word.word.front, word.word.back);
  } else if (stage === 2) {
    renderSingleCard(word.word.back, word.word.front);
  } else if ([3, 4].includes(stage)) {
    renderQuizTwoCard();
  } else if ([5, 6].includes(stage)) {
    renderQuizFourCard('front-to-back');
  } else if (stage === 7) {
    renderQuizFourCard('back-to-front');
  }

if (totalStageCount === 1) {
    nextButton.textContent = "Next stage"; 
  } else {
    nextButton.textContent = "Next word";
  }
if (currentStage === 7 && totalStageCount === 1) {
  nextButton.classList.add("hide");
  finishSetButton.classList.remove("hide");
  finishSetButton.classList.add("next-button");
}
};

getWord();
