export const message = (text) => {
  document.getElementById('user-interface').innerHTML = '';
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  messageContainer.textContent = text;
  document.getElementById('user-interface').appendChild(messageContainer);
  return messageContainer;
};
