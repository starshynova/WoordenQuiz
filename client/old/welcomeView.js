import { START_QUIZ_BUTTON_ID } from "../src/constants.js";
import { NAME_INPUT_ID } from "../src/constants.js";
import { QUESTION_HEADER_ID } from "../src/constants.js";

/**
 * Create the welcome screen
 * @returns {Element}
 */
export const createWelcomeElement = () => {
  const element = document.createElement("div");
  element.innerHTML = String.raw`
    <div id="${QUESTION_HEADER_ID}"><h1>Welcome to the quiz from the team "Birth of dream!"</h1></div>
    <input id="${NAME_INPUT_ID}" />
    <button id="${START_QUIZ_BUTTON_ID}">Let's do it!</button>
  `;
  return element;
};
