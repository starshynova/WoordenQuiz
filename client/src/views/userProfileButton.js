export const userProfileIconContainer = document.createElement('button');
userProfileIconContainer.classList.add('icon-container');
userProfileIconContainer.style.right = '40px';
const iconLogin = document.createElement('img');
iconLogin.src = './assets/icon-profile.svg';
userProfileIconContainer.appendChild(iconLogin);
