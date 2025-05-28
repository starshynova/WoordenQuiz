import { userProfileIconContainer } from '../views/userProfileButton.js';
import { backIconContainer } from '../views/backButton.js';
import { welcomePage } from './welcomePage.js';
import { getWord } from './getWord.js';
import { loginForm } from './loginFormPage.js';
import { userProfilePage } from './userProfilePage.js';

export const instructionPage = () => {
    document.getElementById('user-interface').innerHTML = '';
    backIconContainer.addEventListener('click', () => {
         welcomePage();
       });
    
    const container = document.createElement('div');
    container.classList.add('container');
    const containerHeader = document.createElement('div');
    containerHeader.classList.add('container-header');
    containerHeader.style.fontSize = "36px";
    containerHeader.textContent = 'How to use WoordenQuiz';
    container.appendChild(containerHeader);
    document.getElementById('user-interface').appendChild(container);
    document.getElementById('user-interface').appendChild(backIconContainer);
    document
      .getElementById('user-interface')
      .appendChild(userProfileIconContainer);

    const instructionContainer = document.createElement('div');
    instructionContainer.classList.add('instruction-container');
    
    const instructionTitle = document.createElement('p');
    instructionTitle.textContent = "You learn words in sets of 10 words. Each word goes through 8 stages of memorisation.";
    instructionTitle.classList.add('text-left');
    instructionTitle.classList.add('bold');
    instructionContainer.appendChild(instructionTitle);

    const instructionStage_1_3 = document.createElement('div');

    const instructionStage_1_3_Title = document.createElement('p');
    instructionStage_1_3_Title.textContent = "Stages 1-3 (Get to Know → Repeat → Remember)";
    instructionStage_1_3.appendChild(instructionStage_1_3_Title);

    const stagesList_1_3 = document.createElement('ul');

    const stage1 = document.createElement('li');
    stage1.textContent = "Stage 1: Learn a new word (Dutch → English version)";
    stagesList_1_3.appendChild(stage1);

    const stage2 = document.createElement('li');
    stage2.textContent = "Stage 2: Fixing the pattern (Dutch again → English version)";
    stagesList_1_3.appendChild(stage2);

    const stage3 = document.createElement('li');
    stage3.textContent = "Stage 3: Try to remember (English → Dutch version)";
    stagesList_1_3.appendChild(stage3);

    instructionStage_1_3.appendChild(stagesList_1_3);

    const instructionStage_4_8 = document.createElement('div');

    const instructionStage_4_8_Title = document.createElement('p');
    instructionStage_4_8_Title.textContent = "Stages 4-8 (Test your knowledge — it's important to answer correctly!)";
    instructionStage_4_8.appendChild(instructionStage_4_8_Title);

    const stagesList_4_8 = document.createElement('ul');

    const stage4_5 = document.createElement('li');
    stage4_5.textContent = "Stages 4 and 5: Choose a translation from 2 options";
    stagesList_4_8.appendChild(stage4_5);

    const stage6_7 = document.createElement('li');
    stage6_7.textContent = "Stages 6 and 7: Define translation from 4 options";
    stagesList_4_8.appendChild(stage6_7);

    const stage8 = document.createElement('li');
    stage8.textContent = "Stage 8: Final test (English → Dutch, 4 options)";
    stagesList_4_8.appendChild(stage8);

    instructionStage_4_8.appendChild(stagesList_4_8);

    const nextStep = document.createElement('div');

    const whatNextText = document.createElement('p');
    whatNextText.textContent = "What is next?";
    whatNextText.classList.add('bold');
    whatNextText.classList.add('text-left');

    const mistakeExplain = document.createElement('ul');

    const mistake01 = document.createElement('li');
    mistake01.textContent = "Learned (0-1 mistakes) - the word is considered memorised, not repeated.";
    mistakeExplain.appendChild(mistake01);

    const mistake23  =document.createElement('li');
    mistake23.textContent = "Need to repeat (2-3 mistakes) - the word will come back in the next set, but from stage 6.";
    mistakeExplain.appendChild(mistake23);

    const mistake45 = document.createElement('li');
    mistake45.textContent = "Difficult (4-5 mistakes) - the word will start again, from step 1."
    mistakeExplain.appendChild(mistake45);

    const resume = document.createElement('p');
    resume.classList.add('text-left');
    resume.textContent = "This approach helps to really memorise words - not just to see them once, but to learn them for a long time.";
    
    nextStep.appendChild(whatNextText);
    nextStep.appendChild(mistakeExplain);
    nextStep.appendChild(resume);

    instructionContainer.appendChild(instructionStage_1_3);
    instructionContainer.appendChild(instructionStage_4_8);
    instructionContainer.appendChild(nextStep);
    container.appendChild(instructionContainer);

    const containerButton = document.createElement('div');
    containerButton.classList.add('container-next-button');
    container.appendChild(containerButton);

    const startButton = document.createElement('button');
    startButton.classList.add('next-button');
    startButton.textContent = 'Start WoordenQuiz!';
    containerButton.appendChild(startButton);
    
    const token = localStorage.getItem('token');
      if (token) {
        startButton.addEventListener('click', getWord);
        userProfileIconContainer.addEventListener('click', userProfilePage);
      } else {
        startButton.addEventListener('click', loginForm);
        userProfileIconContainer.addEventListener('click', loginForm);
      }
    
}