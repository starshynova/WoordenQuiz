import { renderSingleCard } from '../views/flashCardView.js'; 
import { renderQuizTwoCard } from '../views/quizTwoCardView.js';
import { renderQuizFourCard } from '../views/quizFourCardView.js';

export let currentWordId;
export let currentStage = 0;
let stageWordCounter = 0;
export let currentCounter = 0;
let incorrectAnswer = false;
export const setIncorrectAnswer = (value) => {
  incorrectAnswer = value;
};

export const getIncorrectAnswer = () => incorrectAnswer;


export const getWord = async() => {
  let word;
  try {
    const response = await fetch('http://localhost:3000/api/word') 
    word = await response.json();
    currentWordId = word._id;
    currentStage = word.stage;
    currentCounter = word.counter;
  } catch (error) {
    console.error('Error getting word:', error);
    return;
  }

  console.log('Word:', word);
  const stage = word.stage;
  setIncorrectAnswer(false);
  
  if ([0, 1].includes(stage)) {
    renderSingleCard(word.front, word.back);
  } else if (stage === 2) {
    renderSingleCard(word.back, word.front);
  } else if ([3, 4].includes(stage)) {
    renderQuizTwoCard();
  } else if ([5, 6].includes(stage)) {
    renderQuizFourCard();
  } else if (stage === 7) {
    renderQuizFourCard(word.back);
  }
  stageWordCounter++;

};


getWord();