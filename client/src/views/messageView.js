import { backIconContainer } from "./backButton.js";
import { welcomePage } from "../pages/welcomePage.js";


export const messageView = (text) => {
  document.getElementById('user-interface').innerHTML = '';
  backIconContainer.addEventListener('click', () => {
      welcomePage();
    });
  
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  messageContainer.textContent = text;
  document.getElementById('user-interface').appendChild(messageContainer);
  document.getElementById('user-interface').appendChild(backIconContainer);
  return messageContainer;
};
