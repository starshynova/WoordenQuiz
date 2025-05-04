import { getWord, userId } from '../pages/getWord.js';
import {
  currentWordId,
  currentStage,
  currentCounter,
  getIncorrectAnswer,
  totalStageCount,
} from '../pages/getWord.js';
import { nextWordSetPage } from './nextWordSetPage.js';
import { API_BASE_URL } from '../../config.js';

export const nextButton = document.createElement('button');

nextButton.classList.add('next-button');

const setUpdateData = async (data) => {
  try {
    await fetch(`${API_BASE_URL}/api/word/update/${userId}/${currentWordId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error when updating a word:', error);
  }
};

export const nextWord = async () => {
  let updateData = {};

  if (currentStage < 8) {
    updateData.stage = currentStage + 1;

    if (getIncorrectAnswer?.() === true) {
      updateData.counter = currentCounter + 1;
    }
  }

  await setUpdateData(updateData);

  document.getElementById('user-interface').innerHTML = '';
  if (currentStage === 7 && totalStageCount === 1) {
    nextWordSetPage();
  } else {
    getWord();
  }
};

nextButton.addEventListener('click', nextWord);
