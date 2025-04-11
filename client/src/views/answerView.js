/**
 * Create an Answer element
 * @returns {Element}
 * @param {string} answerText
 */



export const createAnswerElement = (answerText) => {
  const element = document.createElement('button');
  element.textContent = answerText;

  return element;
};

  