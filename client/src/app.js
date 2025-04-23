import { getWord } from "./pages/getWord.js";
import { welcomePage } from "./pages/welcomePage.js";

const loadApp = () => {
  // getWord();
  welcomePage();
};

window.addEventListener("load", loadApp);
