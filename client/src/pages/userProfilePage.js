import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm';
import { API_BASE_URL } from '../../config.js';
import { message } from '../views/message.js';
import { welcomePage } from './welcomePage.js';


export const userProfilePage = async () => {
    document.getElementById('user-interface').innerHTML = '';
    const iconContainer = document.createElement('button');
    iconContainer.classList.add("icon-container");
    iconContainer.style.left = "40px";
    const iconBack = document.createElement('img');
    iconBack.src = "./assets/back.svg";
    iconContainer.appendChild(iconBack);
    iconContainer.addEventListener('click', () => {
        welcomePage();
    });

    const container = document.createElement('div');
    container.classList.add('container');
    const containerHeader = document.createElement('div');
    containerHeader.classList.add('container-header');
    
    container.appendChild(containerHeader);
    document.getElementById('user-interface').appendChild(container);
    document.getElementById('user-interface').appendChild(iconContainer);
    
    let userData;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
          message('You are not logged in. Please log in to continue.');
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        console.log('Decoded token:', decodedToken);
        console.log("userId form token:", userId);
        const response = await fetch(
          `${API_BASE_URL}/api/user/${userId}`
        );
        const data = await response.json();
        userData = data.user;
        console.log('User data:', userData);
    } catch (error) {
        console.error('Error getting userID:', error);
        return;
    }

    containerHeader.textContent = `Hello, ${userData.name}!`;

    const amountLearnedWords = userData.words.filter((word) => word.status === "learned").length;
    const amountLearnedWordsText = document.createElement('p');
    amountLearnedWordsText.style.whiteSpace = 'pre-line';
    amountLearnedWordsText.style.textAlign = 'center';
    amountLearnedWordsText.textContent = 
    `You have already learned ${amountLearnedWords} words! \n
    You are on the right way! \n
    If you want to check the words you have learnt, just click on the button`;
    container.appendChild(amountLearnedWordsText);

    let setLearnedWords = false;
    const learnedWordsButton = document.createElement('button');
    if (setLearnedWords) {
        learnedWordsButton.textContent = "Hide learned words";
        learnedWordsContainer.innerHTML = ''; 

        const list = userData.words.filter(word => word.status === "learned");

        for (const word of list) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/word/${word.id}`);
                const data = await response.json();

                const wordElement = document.createElement('p');
                wordElement.textContent = `${data.front} - ${data.back}`;
                learnedWordsContainer.appendChild(wordElement);
            } catch (err) {
                console.error("Error fetching word:", err);
            }
        }
    } else {
        learnedWordsButton.textContent = "Learned words";
        learnedWordsContainer.innerHTML = '';
    }
}

