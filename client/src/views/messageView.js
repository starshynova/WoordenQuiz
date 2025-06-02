import { welcomePage } from '../pages/welcomePage.js';

export const messageView = (text) => {
  document.getElementById('user-interface').innerHTML = '';

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  messageContainer.textContent = text;
  document.getElementById('user-interface').appendChild(messageContainer);

  const welcomePageButton = document.createElement('button');
  welcomePageButton.classList.add('next-button');
  welcomePageButton.textContent = 'Back to Welcome Page';
  welcomePageButton.addEventListener('click', () => {
    welcomePage();
  });
  messageContainer.appendChild(welcomePageButton);

  return messageContainer;
};
