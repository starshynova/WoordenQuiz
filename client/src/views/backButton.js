export const backIconContainer = document.createElement('button');
backIconContainer.classList.add("icon-container");
backIconContainer.style.left = "40px";
const iconBack = document.createElement('img');
iconBack.src = "./assets/back.svg";
backIconContainer.appendChild(iconBack);