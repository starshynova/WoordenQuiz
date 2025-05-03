import { getWord } from './pages/getWord.js';
import { userProfilePage } from './pages/userProfilePage.js';
import { welcomePage } from './pages/welcomePage.js';

const loadApp = () => {
  welcomePage();
  // userProfilePage();
};

window.addEventListener('load', loadApp);
