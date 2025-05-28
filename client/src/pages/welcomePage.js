import { loginForm } from './loginFormPage.js';
import { getWord } from './getWord.js';
import { userProfilePage } from './userProfilePage.js';
import { userProfileIconContainer } from '../views/userProfileButton.js';
import { instructionPage } from './instructionPage.js';

export const welcomePage = () => {
  document.getElementById('user-interface').innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  containerHeader.style.fontSize = "48px";
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
  description.textContent = "This app uses a unique repetition system that helps you learn Dutch words efficiently and for a long time. Each word will be shown to you again and again - until you memorise it! Thanks to this repetition logic, you won't lose important knowledge and will quickly expand your vocabulary."
  descriptionContainer.appendChild(description);

  // const stagesDescriptions = [
  //   'Initial introduction to new words. The card shows a Dutch word. Tap to reveal the English translation.',
  //   'Visual enhancement. The card shows again a Dutch word — tap to see the English translation.',
  //   'Develop active memory. The card shows an English word — tap to reveal the Dutch translation.',
  //   'Check understanding with minimal difficulty. The card shows a Dutch word. Choose the correct English translation from two options.',
  //   'Repeat: again a Dutch word and two answer choices.',
  //   'More difficult task of recognising. The card shows a Dutch word with four English translation options.',
  //   'Repeat: again a Dutch word with four answer options.',
  //   'Final check in the reverse direction. The card shows an English word — choose the correct Dutch translation from four options.',
  // ];

  // stagesDescriptions.forEach((description, index) => {
  //   const descriptionElement = document.createElement('div');
  //   descriptionElement.classList.add('description');
  //   const descriptionHeading = document.createElement('h3');
  //   descriptionHeading.textContent = `Stage ${index + 1}`;
  //   const descriptionText = document.createElement('h4');
  //   descriptionText.textContent = description;

  //   descriptionElement.appendChild(descriptionHeading);
  //   descriptionElement.appendChild(descriptionText);
  //   descriptionContainer.appendChild(descriptionElement);
  // });

  const containerButtons = document.createElement('div');
  containerButtons.classList.add('container-next-button');
  container.appendChild(containerButtons);

  const instructionButton = document.createElement('button');
  instructionButton.classList.add('next-button');
  instructionButton.style.marginRight = "20px";
  instructionButton.textContent = 'Instructions';
  instructionButton.addEventListener('click', instructionPage)
  containerButtons.appendChild(instructionButton);

  const startButton = document.createElement('button');
  startButton.classList.add('next-button');
  startButton.style.marginLeft = "20px";
  startButton.textContent = 'Start WoordenQuiz!';
  containerButtons.appendChild(startButton);

  const token = localStorage.getItem('token');
  if (token) {
    startButton.addEventListener('click', getWord);
    userProfileIconContainer.addEventListener('click', userProfilePage);
  } else {
    startButton.addEventListener('click', loginForm);
    userProfileIconContainer.addEventListener('click', loginForm);
  }
};
