import {
  USER_INTERFACE_ID,
  START_QUIZ_BUTTON_ID,
  NAME_INPUT_ID,
} from "../src/constants.js";
import { createWelcomeElement } from "./welcomeView.js";
import { initQuestionPage } from "./questionPage.js";
import { getWord } from "../src/pages/flashCardPage.js";

export let userName = "";

export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = "";

  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  const nameInput = document.getElementById(NAME_INPUT_ID);
  nameInput.type = "text";
  nameInput.placeholder = "Your name is...";

  document
    .getElementById(START_QUIZ_BUTTON_ID)
    .addEventListener("click", () => {
      userName = nameInput.value;
      // initQuestionPage()
      getWord();
    });
};
