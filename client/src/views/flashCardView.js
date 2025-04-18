import { currentWordId } from '../pages/flashCardPage.js';
import { getWord } from '../pages/flashCardPage.js';

export function renderSingleCard({ front, back }) {
    const container = document.createElement('div');
    container.className = 'card-container';
    const card = createCard(front, back);

    // const nextButton = document.createElement('button');
    // nextButton.textContent = 'Next word';
    // nextButton.className = 'next-button';

    // nextButton.addEventListener('click', async () => {
    //     try {
    //         await fetch(`http://localhost:3000/api/word/${currentWordId}`, {
    //           method: 'PUT',
    //           headers: {
    //             'Content-Type': 'application/json'
    //           },
    //           body: JSON.stringify({ stage: 1 }) 
    //         });
    //       } catch (error) {
    //         console.error('Error when updating a word:', error);
    //       }
        
      
    //     document.getElementById('user-interface').innerHTML = '';
      
    //    getWord();
    // });

    container.appendChild(nextButton);
    
    container.appendChild(card);
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
  