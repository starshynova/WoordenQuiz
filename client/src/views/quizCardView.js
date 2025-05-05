import { generateTwoAnswers } from './generateTwoAnswers.js';
import {
  generateFourAnswers,
  generateFourAnswersInversion,
} from './generateFourAnswers.js';
import { nextButton } from './nextWordButton.js';
import {
  currentStage,
  setIncorrectAnswer,
  totalStageCount,
  totalStageNewCount,
} from '../pages/getWord.js';
import { nextWord } from './nextWordButton.js';
import { userProfileIconContainer } from './userProfileButton.js';
import { backIconContainer } from './backButton.js';
import { welcomePage } from '../pages/welcomePage.js';
import { userProfilePage } from '../pages/userProfilePage.js';

export const renderQuizCard = async (
  answerCount,
  direction = 'front-to-back'
) => {
  document.getElementById('user-interface').innerHTML = '';
  backIconContainer.addEventListener('click', () => {
    welcomePage();
  });
  userProfileIconContainer.addEventListener('click', () => {
    userProfilePage();
  });
  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  if (currentStage === 3 || currentStage === 4) {
    containerHeader.textContent = `Stage ${currentStage}. You are able to choose one of two answers.`;
  } else if (currentStage > 4 || currentStage < 8) {
    containerHeader.textContent = `Stage ${currentStage}. You are able to choose one of four answers.`;
  }
  container.appendChild(containerHeader);
  const containerNextButton = document.createElement('div');
  containerNextButton.classList.add('container-next-button');
  nextButton.classList.add('hide');
  containerNextButton.appendChild(nextButton);

  let stageCount;
  if (answerCount === 4) {
    stageCount = totalStageCount;
  } else if (answerCount === 2) {
    stageCount = totalStageNewCount;
  }

  if (stageCount === 1) {
    nextButton.classList.remove('hide');
  }
  if (currentStage < 7) {
    nextButton.textContent = 'Go to the next stage';
  } else if (currentStage === 7) {
    nextButton.textContent = 'Finish this set';
  }

  const cardBlock = await createCardBlock(
    container,
    answerCount,
    direction,
    stageCount
  );
  container.appendChild(cardBlock);
  container.appendChild(containerNextButton);

  document.getElementById('user-interface').appendChild(backIconContainer);
  document
    .getElementById('user-interface')
    .appendChild(userProfileIconContainer);
  document.getElementById('user-interface').appendChild(container);
};

const createCardBlock = async (
  container,
  answerCount,
  direction,
  stageCount
) => {
  let data;
  if (answerCount === 2) {
    data = await generateTwoAnswers();
  } else if (answerCount === 4) {
    if (direction === 'front-to-back') {
      data = await generateFourAnswers();
    } else if (direction === 'back-to-front') {
      data = await generateFourAnswersInversion();
    } else {
      console.error('Unknown direction:', direction);
      return;
    }
  }

  const quizBlock = document.createElement('div');
  quizBlock.classList.add('quiz-block');
  container.appendChild(quizBlock);
  const question = document.createElement('div');
  question.classList.add('question');
  question.textContent = data.question;
  quizBlock.appendChild(question);

  const answerContainer = document.createElement('div');
  answerContainer.className = 'answer-block';
  quizBlock.appendChild(answerContainer);

  const correctAnswer = data.correctAnswer;

  const createAnswerElement = (answerText) => {
    const element = document.createElement('button');
    if (answerCount === 4) {
      element.classList.add('answer');
    } else if (answerCount === 2) {
      element.classList.add('answer-big');
    }
    element.textContent = answerText;

    element.addEventListener('click', () => {
      document.querySelectorAll('.answer, .answer-big').forEach((btn) => {
        btn.disabled = true;
      });

      if (answerText === correctAnswer) {
        element.classList.add('correct-answer');
        if (stageCount === 1) {
          nextButton.disabled = false;
        } else {
          setTimeout(() => {
            nextWord();
          }, 1000);
        }
      } else {
        element.classList.add('incorrect-answer');
        setIncorrectAnswer(true);

        const correctAnswerElement = Array.from(answerContainer.children).find(
          (btn) => btn.innerText === correctAnswer
        );
        if (correctAnswerElement) {
          correctAnswerElement.classList.add('correct-answer');
        }
        if (stageCount === 1) {
          nextButton.disabled = false;
        } else {
          setTimeout(() => {
            nextWord();
          }, 1000);
        }
      }
      if (stageCount === 1) {
        nextButton.disabled = false;
      }
    });

    return element;
  };

  data.options.forEach((option) => {
    const answerElement = createAnswerElement(option);
    answerContainer.appendChild(answerElement);
  });

  return answerContainer;
};
