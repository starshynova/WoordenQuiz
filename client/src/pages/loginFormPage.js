import { registerForm } from './registerFormPage.js';
import { getWord } from './getWord.js';
import { API_BASE_URL } from '../../config.js';

export const loginForm = () => {
  document.getElementById('user-interface').innerHTML = '';
  const loginContainer = document.createElement('div');
  loginContainer.classList.add('login-container');
  document.getElementById('user-interface').appendChild(loginContainer);

  const loginContainerHeader = document.createElement('div');
  loginContainerHeader.classList.add('login-container-header');
  loginContainerHeader.textContent = 'Please log in';
  loginContainer.appendChild(loginContainerHeader);

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  loginContainer.appendChild(inputContainer);

  const emailInputContainer = document.createElement('div');
  emailInputContainer.classList.add('field-input-container');
  const emailInput = document.createElement('input');
  emailInput.type = 'text';
  emailInput.placeholder = 'E-mail';
  emailInputContainer.appendChild(emailInput);
  inputContainer.appendChild(emailInputContainer);

  const passwordInputContainer = document.createElement('div');
  passwordInputContainer.classList.add('field-input-container');
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Password';
  passwordInputContainer.appendChild(passwordInput);
  inputContainer.appendChild(passwordInputContainer);

  const emailError = document.createElement('h5');
  emailError.textContent = 'E-mail is required field';
  emailError.classList.add('hide');
  emailInputContainer.appendChild(emailError);

  const passwordError = document.createElement('h5');
  passwordError.textContent = 'Password is required field';
  passwordError.classList.add('hide');
  passwordInputContainer.appendChild(passwordError);

  const checkErrors = () => {
    let error = false;
    if (emailInput.value === '') {
      emailError.classList.remove('hide');
      error = true;
    } else {
      emailError.classList.add('hide');
    }

    if (passwordInput.value === '') {
      passwordError.classList.remove('hide');
      error = true;
    } else {
      passwordError.classList.add('hide');
    }
    return error;
  };

  const loginButton = document.createElement('button');
  loginButton.classList.add('next-button');
  loginButton.style.width = '200px';
  loginButton.textContent = 'Log In';

  const registerMessage = document.createElement('div');
  const message = document.createElement('p');
  message.textContent = "Don't have an account? ";

  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'Register';
  link.classList.add('register-link');

  link.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm();
  });

  const buttonMessageContainer = document.createElement('div');
  buttonMessageContainer.classList.add('button-message-container');

  buttonMessageContainer.appendChild(loginButton);
  registerMessage.appendChild(link);
  buttonMessageContainer.appendChild(registerMessage);

  message.appendChild(link);
  registerMessage.appendChild(message);
  loginContainer.appendChild(buttonMessageContainer);

  loginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const hasErrors = checkErrors();
    if (!hasErrors) {
      const user = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
      };
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        if (!response.ok) {
          passwordError.classList.remove('hide');
          passwordError.textContent = data.error || 'Login failed';
        } else {
          sessionStorage.setItem('token', data.token);
          await getWord();
        }
      } catch (error) {
        console.error('Error:', error);
        passwordError.classList.remove('hide');
        passwordError.textContent = 'Network error. Please try again later.';
      }
    }
  });
};
