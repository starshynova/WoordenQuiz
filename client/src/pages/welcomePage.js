import { loginForm } from "../views/loginForm.js";

export const welcomePage = () => {
    document.getElementById("user-interface").innerHTML = "";
    const container = document.createElement("div");
    container.classList.add("container");
    const containerHeader = document.createElement("div");
    containerHeader.classList.add("container-header");
    containerHeader.textContent = "Welcome to WoordenQuiz!"
    container.appendChild(containerHeader);
    document.getElementById("user-interface").appendChild(container);

    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList.add("description-container");
    container.appendChild(descriptionContainer);

    const stagesDescriptions = [
        "Description of the first stage.",
        "Description of the second stage.",
        "Description of the third stage.",
        "Description of the fourth stage.",
        "Description of the fifth stage.",
        "Description of the sixth stage.",
        "Description of the seventh stage.",
        "Description of the eighth stage."
      ];

      stagesDescriptions.forEach((description, index) => {
        const descriptionElement = document.createElement("div");
        descriptionElement.classList.add("description");  
        // descriptionElement.textContent = description;  
        const descriptionHeading = document.createElement("h3");
        descriptionHeading.textContent = `Stage ${index + 1}`;
        const descriptionText = document.createElement("p");
        descriptionText.textContent = description;
      
        // descriptionElement.style.backgroundColor = index % 2 === 0 ? "#f0f0f0" : "#e0e0e0"; 
        descriptionElement.appendChild(descriptionHeading);
        descriptionElement.appendChild(descriptionText);
        descriptionContainer.appendChild(descriptionElement);  
      });

      const containerStartButton = document.createElement("div");
      containerStartButton.classList.add("container-next-button");
      container.appendChild(containerStartButton);

      const startButton = document.createElement("button");
      startButton.classList.add("next-button");
      startButton.textContent = "Start WoordenQuiz!";
      containerStartButton.appendChild(startButton);

      startButton.addEventListener("click", loginForm)
}
