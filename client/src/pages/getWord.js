import { renderSingleCard } from '../views/flashCardView.js';
import { renderQuizCard } from '../views/quizCardView.js';
import { message } from '../views/message.js';
import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm';

export let userId;
export let currentWordId;
export let currentStage;
export let currentCounter;
let incorrectAnswer = false;
export const setIncorrectAnswer = (value) => {
  incorrectAnswer = value;
};
export let totalStageNewCount = 0;
export let totalStageCount = 0;

export const getIncorrectAnswer = () => incorrectAnswer;

export const getWord = async () => {
  let word;
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message('You are not logged in. Please log in to continue.');
    }
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    const response = await fetch(
      `http://localhost:3000/api/word/vocabulary/${userId}`
    );
    word = await response.json();
    currentWordId = word.word._id;
    currentStage = word.word.stage;
    totalStageNewCount = word.totalWordsWithStageNew;
    totalStageCount = word.totalWordsWithStage;
    currentCounter = word.word.counter;
  } catch (error) {
    console.error('Error getting word:', error);
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
};
