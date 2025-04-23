export const registerForm = () => {
    document.getElementById("user-interface").innerHTML = "";
    const loginContainer = document.createElement("div");
loginContainer.classList.add("login-container");
document.getElementById("user-interface").appendChild(loginContainer);

const loginContainerHeader = document.createElement("div");
loginContainerHeader.classList.add("login-container-header");
loginContainerHeader.textContent = "Registration form"
loginContainer.appendChild(loginContainerHeader);

const inputContainer = document.createElement("div");
inputContainer.classList.add("input-container");
inputContainer.style.marginTop = "-20px";
loginContainer.appendChild(inputContainer);

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Name";
inputContainer.appendChild(nameInput);

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
confirmPasswordInput.placeholder = "Confirm password";
inputContainer.appendChild(confirmPasswordInput);

const registerButton = document.createElement("button");
registerButton.classList.add("next-button");
registerButton.style.width = "200px";
registerButton.style.position = "absolute";
registerButton.style.bottom = "40px";
registerButton.textContent = "Register";
loginContainer.appendChild(registerButton);
}