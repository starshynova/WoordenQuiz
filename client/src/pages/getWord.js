import { renderSingleCard } from '../views/flashCardView.js';
import { renderQuizCard } from '../views/quizCardView.js';
import { messageView } from '../views/messageView.js';
import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm';
import { API_BASE_URL } from '../../config.js';
import { nextWordSetPage } from '../views/nextWordSetPage.js';

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
    const token = sessionStorage.getItem('token');
    if (!token) {
      messageView('You are not logged in. Please log in to continue.');
    }
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    const response = await fetch(
      `${API_BASE_URL}/api/word/vocabulary/${userId}`
    );
    word = await response.json();
    if (word.needToUpdate) {
      nextWordSetPage();
    }
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
