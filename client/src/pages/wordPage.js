import { renderSingleCard } from '../views/flashCardView.js'; 

export let currentWordId;
let stageWordCounter = 0;
export const  getWord = async() => {
  let word;
  try {
    const response = await fetch('http://localhost:3000/api/word') 
    word = await response.json();
    currentWordId = word._id;
  } catch (error) {
    console.error('Error getting word:', error);
    return;
  }

  console.log('Word:', word);
  const stage = word.stage;
  
  if ([0, 1].includes(stage)) {
    renderSingleCard(word.front, word.back);
  } else if (stage === 2) {
    renderSingleCard(word.back, word.front);
  } else if ([3, 4].includes(stage)) {
    renderQuizTwoCard(word.face);
  } else if ([5, 6].includes(stage)) {
    renderQuizFourCard(word.face);
  } else if (stage === 7) {
    renderQuizFourCard(word.back);
  }
  stageWordCounter++;

};


getWord();