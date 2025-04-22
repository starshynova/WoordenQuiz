import { getWord } from "./pages/getWord.js";

const loadApp = () => {
  getWord();
};

window.addEventListener("load", loadApp);
