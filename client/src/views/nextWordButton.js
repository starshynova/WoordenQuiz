import { getWord } from "../pages/wordPage.js"
import { currentWordId } from '../pages/wordPage.js';

export const nextButton = document.createElement('button');
nextButton.textContent = 'Next word';
nextButton.className = 'next-button';

nextButton.addEventListener('click', async () => {
    try {
        await fetch(`http://localhost:3000/api/word/${currentWordId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stage: 1 }) 
        });
      } catch (error) {
        console.error('Error when updating a word:', error);
      }
    
  
    document.getElementById('user-interface').innerHTML = '';
  
   getWord();
});