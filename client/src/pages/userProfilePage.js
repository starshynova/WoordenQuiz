import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm';
import { API_BASE_URL } from '../../config.js';
import { message } from '../views/message.js';
import { welcomePage } from './welcomePage.js';
import { getWord } from './getWord.js';
import { backIconContainer } from '../views/backButton.js';

export const userProfilePage = async () => {
  document.getElementById('user-interface').innerHTML = '';
  backIconContainer.addEventListener('click', () => {
    welcomePage();
  });

  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');

  container.appendChild(containerHeader);
  document.getElementById('user-interface').appendChild(container);
  document.getElementById('user-interface').appendChild(backIconContainer);

  let userData;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      message('You are not logged in. Please log in to continue.');
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
    console.log('Decoded token:', decodedToken);
    console.log('userId form token:', userId);
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
    const data = await response.json();
    userData = data.user;
    console.log('User data:', userData);
  } catch (error) {
    console.error('Error getting userID:', error);
    return;
  }

  containerHeader.textContent = `Hello, ${userData.name}!`;

  let setLearnedWords = false;

  const learnedWordsContainer = document.createElement('div');
  learnedWordsContainer.classList.add('learned-words-container');
  const amountLearnedWords = userData.words.filter(
    (word) => word.status === 'learned'
  ).length;
  const amountLearnedWordsText = document.createElement('p');
  amountLearnedWordsText.style.whiteSpace = 'pre-line';
  amountLearnedWordsText.style.textAlign = 'center';
  amountLearnedWordsText.textContent = `You have already learned ${amountLearnedWords} words! \n
    You are on the right way! \n
    If you want to check the words you have learnt, just click on the button`;
  learnedWordsContainer.appendChild(amountLearnedWordsText);

  const learnedWordsList = document.createElement('ol');
  const learnedWordsButton = document.createElement('button');
  learnedWordsButton.classList.add('learned-words-button');
  const continueLearningButton = document.createElement('button');
  continueLearningButton.classList.add('next-button');
  continueLearningButton.style.marginTop = '20px';

  continueLearningButton.textContent = 'Continue learning the words';
  continueLearningButton.addEventListener('click', () => {
    document.body.style.height = '100vh';
    getWord();
  });
  learnedWordsContainer.appendChild(learnedWordsList);
  learnedWordsContainer.appendChild(learnedWordsButton);
  container.appendChild(learnedWordsContainer);
  learnedWordsContainer.appendChild(continueLearningButton);
  learnedWordsButton.textContent = 'Learned words';

  learnedWordsButton.addEventListener('click', async () => {
    setLearnedWords = !setLearnedWords;
    if (setLearnedWords) {
      learnedWordsList.innerHTML = '';
      document.body.style.height = 'auto';
      document.body.style.margin = '40px auto';
      learnedWordsContainer.style.justifyContent = 'start';
      amountLearnedWordsText.textContent = 'Words you have already learned:';
      containerHeader.classList.add('hide');
      amountLearnedWordsText.style.paddingTop = '40px';
      continueLearningButton.style.marginBottom = '20px';

      const list = userData.words.filter((word) => word.status === 'learned');
      if (list.length === 0) {
        learnedWordsButton.classList.add('hide');
      }

      for (const word of list) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/word/${word._id}`);
          const data = await response.json();

          const wordElement = document.createElement('li');
          wordElement.textContent = `${data.front} - ${data.back}`;
          learnedWordsList.appendChild(wordElement);
        } catch (err) {
          console.error('Error fetching word:', err);
        }
      }
      learnedWordsButton.textContent = 'Hide learned words';
    } else {
      learnedWordsButton.textContent = 'Learned words';
      learnedWordsList.innerHTML = '';
      containerHeader.classList.remove('hide');
      learnedWordsContainer.style.justifyContent = 'center';
      amountLearnedWordsText.textContent = `You have already learned ${amountLearnedWords} words! \n
            You are on the right way! \n
            If you want to check the words you have learnt, just click on the button`;
    }
  });
};
