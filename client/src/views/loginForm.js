import { registerForm } from "./registerForm.js";

export const loginForm = () => {
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

const loginButton = document.createElement("button");
loginButton.classList.add("next-button");
loginButton.textContent = "Log In";
loginContainer.appendChild(loginButton);

const registerMessage = document.createElement("div");
const message = document.createElement("p");
  message.textContent = "Don't have an account? ";

  const link = document.createElement("a");
  link.href = "#"; 
  link.textContent = "Register";
  link.classList.add("register-link");

  link.addEventListener("click", (e) => {
    e.preventDefault(); 
    registerForm();   
  });

  message.appendChild(link);
  registerMessage.appendChild(message);
  loginContainer.appendChild(registerMessage);
  


}