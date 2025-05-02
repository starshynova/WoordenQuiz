import { getWord, userId } from '../pages/getWord.js';

export const nextWordSetPage = () => {
  document.getElementById('user-interface').innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('set-finished');

  const message = document.createElement('p');
  message.textContent = 'You’ve finished this set!';
  message.classList.add('set-message');

  const nextWordSetButton = document.createElement('button');
  nextWordSetButton.textContent = 'Next 10 words';
  nextWordSetButton.classList.add('next-button');

  container.appendChild(message);
  container.appendChild(nextWordSetButton);
  document.getElementById('user-interface').appendChild(container);

  const updateWords = async (data) => {
    try {
      await fetch(`/api/word/${userId}/update-words`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error when updating collections:', error);
    }
  };

  nextWordSetButton.addEventListener('click', async () => {
    await updateWords();

    document.getElementById('user-interface').innerHTML = '';
    await getWord();
  });
};
