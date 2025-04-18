// import { currentWordId } from '../pages/flashCardPage.js';
// import { getWord } from '../pages/flashCardPage.js';
import {nextButton} from "./nextWordButton.js"

export function renderSingleCard(front, back) {
    const container = document.createElement('div');
    container.className = 'card-container';
    const card = createCard(front, back);

    container.appendChild(card);
    container.appendChild(nextButton);
    
    
    document.getElementById('user-interface').appendChild(container);
  }
  
 
  function createCard(frontText, backText) {
    const card = document.createElement('div');
    card.className = 'card';
  
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
  