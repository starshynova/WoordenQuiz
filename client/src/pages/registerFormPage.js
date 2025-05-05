import { loginForm } from './loginFormPage.js';
import { message } from '../views/message.js';
import { API_BASE_URL } from '../../config.js';

export const registerForm = () => {
  document.getElementById('user-interface').innerHTML = '';
  const registerContainer = document.createElement('div');
  registerContainer.classList.add('login-container');
  document.getElementById('user-interface').appendChild(registerContainer);

  const registerContainerHeader = document.createElement('div');
  registerContainerHeader.classList.add('login-container-header');
  registerContainerHeader.textContent = 'Registration form';
  registerContainer.appendChild(registerContainerHeader);

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  registerContainer.appendChild(inputContainer);

  const nameInputContainer = document.createElement('div');
  nameInputContainer.classList.add('field-input-container');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Name';
  nameInputContainer.appendChild(nameInput);

  const emailInputContainer = document.createElement('div');
  emailInputContainer.classList.add('field-input-container');
  const emailInput = document.createElement('input');
  emailInput.type = 'text';
  emailInput.placeholder = 'E-mail';
  emailInputContainer.appendChild(emailInput);

  const passwordInputContainer = document.createElement('div');
  passwordInputContainer.classList.add('field-input-container');
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Password';
  passwordInputContainer.appendChild(passwordInput);

  const confirmPasswordInputContainer = document.createElement('div');
  confirmPasswordInputContainer.classList.add('field-input-container');
  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordInput.placeholder = 'Confirm password';
  confirmPasswordInputContainer.appendChild(confirmPasswordInput);

  const nameError = document.createElement('h5');
  nameError.textContent = 'Name can not be empty';
  nameError.classList.add('hide');
  nameInputContainer.appendChild(nameError);

  const emailError = document.createElement('h5');
  emailError.textContent = 'E-mail format is not correct';
  emailError.classList.add('hide');
  emailInputContainer.appendChild(emailError);

  const emailExistError = document.createElement('h5');
  emailExistError.textContent =
    'This email is already registered. Please, try another one.';
  emailExistError.classList.add('hide');
  emailInputContainer.appendChild(emailExistError);

  const passwordError = document.createElement('h5');
  passwordError.textContent =
    'Password must be at least 8 characters long and contain at least one number and one special character.';
  passwordError.classList.add('hide');
  passwordInputContainer.appendChild(passwordError);

  const confirmPasswordError = document.createElement('h5');
  confirmPasswordError.textContent =
    'Password and confirm password do not match.';
  confirmPasswordError.classList.add('hide');
  confirmPasswordInputContainer.appendChild(confirmPasswordError);

  inputContainer.appendChild(nameInputContainer);
  inputContainer.appendChild(emailInputContainer);
  inputContainer.appendChild(passwordInputContainer);
  inputContainer.appendChild(confirmPasswordInputContainer);

  let errorCounter = 0;

  const registerButton = document.createElement('button');
  registerButton.classList.add('next-button');
  registerButton.style.width = '200px';
  registerButton.textContent = 'Register';
  registerButton.disabled = true;

  const loginMessage = document.createElement('div');
  const message = document.createElement('p');
  message.textContent = "Do you already have an account? ";

  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'Login';
  link.classList.add('register-link');

  link.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm();
  });

  const buttonMessageContainer = document.createElement('div');
  buttonMessageContainer.classList.add('button-message-container');

  buttonMessageContainer.appendChild(registerButton);
  loginMessage.appendChild(link);
  buttonMessageContainer.appendChild(loginMessage);

  message.appendChild(link);
  loginMessage.appendChild(message);
  registerContainer.appendChild(buttonMessageContainer);

  function updateButtonState() {
    const isFormValid =
      nameInput.value.trim() !== '' &&
      emailInput.value.trim() !== '' &&
      passwordInput.value.trim() !== '' &&
      confirmPasswordInput.value.trim() !== '' &&
      errorCounter === 0;

    registerButton.disabled = !isFormValid;
  }

  const checkErrors = () => {
    errorCounter = 0;

    if (!nameInput.value.trim()) {
      nameError.classList.remove('hide');
      errorCounter++;
    } else {
      nameError.classList.add('hide');
    }

    const email = emailInput.value.trim();
    if (email === '') {
      emailError.classList.add('hide');
      emailExistError.classList.add('hide');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailError.classList.remove('hide');
        errorCounter++;
      } else {
        emailError.classList.add('hide');
      }
    }

    const password = passwordInput.value;
    if (password === '') {
      passwordError.classList.add('hide');
    } else {
      const passwordRegex =
        /^(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
      if (!passwordRegex.test(password)) {
        passwordError.classList.remove('hide');
        errorCounter++;
      } else {
        passwordError.classList.add('hide');
      }
    }

    const confirmPassword = confirmPasswordInput.value;
    if (confirmPassword === '') {
      confirmPasswordError.classList.add('hide');
    } else if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordError.classList.remove('hide');
      errorCounter++;
    } else {
      confirmPasswordError.classList.add('hide');
    }

    updateButtonState();
  };

  [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
    (input) => {
      input.addEventListener('change', () => {
        checkErrors();

        if (input === emailInput && emailInput.value.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(emailInput.value.trim())) {
            checkEmailExistence(emailInput.value.trim()).then((exists) => {
              if (exists) {
                emailExistError.classList.remove('hide');
                errorCounter++;
              } else {
                emailExistError.classList.add('hide');
              }
              updateButtonState();
            });
          }
        }
      });
    }
  );

  const checkEmailExistence = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.message);
      } else {
        const text = 'Registration successful! Redirecting to login page...';
        message(text);
        setTimeout(() => {
          loginForm();
        }, 3000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed, please try again.');
    }
  };

  const handleFormSubmit = async (event) => {
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    event.preventDefault();

    registerUser(name, email, password);
  };

  registerButton.addEventListener('click', handleFormSubmit);
};
