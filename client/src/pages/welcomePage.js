import { loginForm } from './loginFormPage.js';
import { getWord } from './getWord.js';
import { userProfilePage } from './userProfilePage.js';
import { userProfileIconContainer } from '../views/userProfileButton.js';
import { instructionPage } from './instructionPage.js';
import { payment } from './paymentPage.js';
import { categoryPage } from './categoryPage.js';

export const welcomePage = () => {
  document.getElementById('user-interface').innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  containerHeader.style.fontSize = '48px';
  containerHeader.textContent = 'Welcome to WoordenQuiz!';
  container.appendChild(containerHeader);
  document.getElementById('user-interface').appendChild(container);
  document
    .getElementById('user-interface')
    .appendChild(userProfileIconContainer);

  const descriptionContainer = document.createElement('div');
  descriptionContainer.classList.add('description-container');
  container.appendChild(descriptionContainer);

  const description = document.createElement('h2');
  description.textContent =
    "This app uses a unique repetition system that helps you learn Dutch words efficiently and for a long time. Each word will be shown to you again and again - until you memorise it! Thanks to this repetition logic, you won't lose important knowledge and will quickly expand your vocabulary.";
  descriptionContainer.appendChild(description);

  const containerButtons = document.createElement('div');
  containerButtons.classList.add('container-next-button');
  container.appendChild(containerButtons);

  const instructionButton = document.createElement('button');
  instructionButton.classList.add('next-button');
  instructionButton.style.marginRight = '20px';
  instructionButton.textContent = 'Instructions';
  instructionButton.addEventListener('click', instructionPage);
  containerButtons.appendChild(instructionButton);

  const startButton = document.createElement('button');
  startButton.classList.add('next-button');
  startButton.style.marginLeft = '20px';
  startButton.textContent = 'Start WoordenQuiz!';
  containerButtons.appendChild(startButton);

  const donateButton = document.createElement('button');
  donateButton.classList.add('next-button');
  donateButton.style.marginLeft = '20px';
  donateButton.textContent = 'Donate';
  donateButton.addEventListener('click', payment);
  containerButtons.appendChild(donateButton);

  const categoryButton = document.createElement('button');
  categoryButton.classList.add('next-button');
  categoryButton.style.marginLeft = '20px';
  categoryButton.textContent = 'Categories';
  categoryButton.addEventListener('click', categoryPage)
  containerButtons.appendChild(categoryButton);

  

  const token = sessionStorage.getItem('token');
  if (token) {
    startButton.addEventListener('click', getWord);
    userProfileIconContainer.addEventListener('click', userProfilePage);
  } else {
    startButton.addEventListener('click', loginForm);
    userProfileIconContainer.addEventListener('click', loginForm);
  }
};
