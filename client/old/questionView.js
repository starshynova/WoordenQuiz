import { ANSWERS_LIST_ID } from "../src/constants.js";
import { QUESTION_HEADER_ID } from "../src/constants.js";

/**
 * Create a full question element
 * @returns {Element}
 * @param {string} questionText
 */
export const createQuestionElement = (questionText) => {
  const element = document.createElement("div");

  element.innerHTML = String.raw`
 <div id="${QUESTION_HEADER_ID}"><h1>${questionText}</h1></div>

 <div id="${ANSWERS_LIST_ID}">
  </div> 

  
`;

  return element;
};
