import { nextButton } from './nextWordButton.js';
import { currentStage, totalStageNewCount } from '../pages/getWord.js';
import { backIconContainer } from '../views/backButton.js';
import { userProfileIconContainer } from './userProfileButton.js';
import { welcomePage } from '../pages/welcomePage.js';
import { userProfilePage } from '../pages/userProfilePage.js';

export function renderSingleCard(front, back) {
  document.getElementById('user-interface').innerHTML = '';
  backIconContainer.addEventListener('click', () => {
    welcomePage();
  });
  userProfileIconContainer.addEventListener('click', () => {
    userProfilePage();
  });
  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  containerHeader.textContent = `Flash-card from ${currentStage + 1} stage`;

  const card = createCard(front, back);

  if ((nextButton.className = 'hide')) {
    nextButton.classList.remove('hide');
    nextButton.classList.add('next-button');
  }

  if (totalStageNewCount === 1) {
    nextButton.textContent = 'Go to the next stage';
  } else {
    nextButton.textContent = 'Next word';
  }

  const containerNexButton = document.createElement('div');
  containerNexButton.classList.add('container-next-button');
  containerNexButton.appendChild(nextButton);

  container.appendChild(containerHeader);
  container.appendChild(card);
  container.appendChild(containerNexButton);

  document.getElementById('user-interface').appendChild(backIconContainer);
  document
    .getElementById('user-interface')
    .appendChild(userProfileIconContainer);
  document.getElementById('user-interface').appendChild(container);
}

function createCard(frontText, backText) {
  const card = document.createElement('div');
  card.classList.add('card');

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const front = document.createElement('div');
  front.className = 'card-front';
  front.textContent = frontText;

  const back = document.createElement('div');
  back.className = 'card-back';
  back.textContent = backText;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  return card;
}
