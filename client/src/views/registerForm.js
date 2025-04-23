export const registerForm = () => {
    document.getElementById("user-interface").innerHTML = "";
    const loginContainer = document.createElement("div");
loginContainer.classList.add("login-container");
document.getElementById("user-interface").appendChild(loginContainer);

const loginContainerHeader = document.createElement("div");
loginContainerHeader.classList.add("login-container-header");
loginContainerHeader.textContent = "Please log in"
loginContainer.appendChild(loginContainerHeader);

const inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
loginContainer.appendChild(inputContainer);

const emailInput = document.createElement("input");
emailInput.type = "text";
emailInput.placeholder = "E-mail";
inputContainer.appendChild(emailInput);

const passwordInput = document.createElement("input");
passwordInput.type = "text";
passwordInput.placeholder = "Password";
inputContainer.appendChild(passwordInput);

const confirmPasswordInput = document.createElement("input");
confirmPasswordInput.type = "text";
confirmPasswordInput.placeholder = "Password";
inputContainer.appendChild(confirmPasswordInput);

const loginButton = document.createElement("button");
loginButton.classList.add("next-button");
loginButton.textContent = "Register";
loginContainer.appendChild(loginButton);
}