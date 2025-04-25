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

const nameInputContainer = document.createElement("div");
const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Name";
nameInputContainer.appendChild(nameInput);

const emailInputContainer = document.createElement("div");
const emailInput = document.createElement("input");
emailInput.type = "text";
emailInput.placeholder = "E-mail";
emailInputContainer.appendChild(emailInput);

const passwordInputContainer = document.createElement("div");
const passwordInput = document.createElement("input");
passwordInput.type = "password";
passwordInput.placeholder = "Password";
passwordInputContainer.appendChild(passwordInput);

const confirmPasswordInputContainer = document.createElement("div");
const confirmPasswordInput = document.createElement("input");
confirmPasswordInput.type = "password";
confirmPasswordInput.placeholder = "Confirm password";
confirmPasswordInputContainer.appendChild(confirmPasswordInput);



const nameError = document.createElement("h5");
nameError.textContent = "Name can not be empty";
nameError.classList.add("hide"); 
nameInputContainer.appendChild(nameError);

const emailError = document.createElement("h5");
emailError.textContent = "E-mail format is not correct";
emailError.classList.add("hide"); 
emailInputContainer.appendChild(emailError);

const emailExistError = document.createElement("h5");
emailExistError.textContent = "This email is already registered. Please, try another one.";
emailExistError.classList.add("hide"); 
emailInputContainer.appendChild(emailExistError);

const passwordError = document.createElement("h5");
passwordError.textContent = "Password must be at least 8 characters long and contain at least one number and one special character.";
passwordError.classList.add("hide"); 
passwordInputContainer.appendChild(passwordError);

const confirmPasswordError = document.createElement("h5");
confirmPasswordError.textContent = "Password and confirm password do not match.";
confirmPasswordError.classList.add("hide"); 
confirmPasswordInputContainer.appendChild(confirmPasswordError);



inputContainer.appendChild(nameInputContainer);
inputContainer.appendChild(emailInputContainer);
inputContainer.appendChild(passwordInputContainer);
inputContainer.appendChild(confirmPasswordInputContainer);

let errorCounter = 0;


const registerButton = document.createElement("button");
registerButton.classList.add("next-button");
registerButton.style.width = "200px";
registerButton.style.position = "absolute";
registerButton.style.bottom = "40px";
registerButton.textContent = "Register";
registerButton.disabled = true; 
loginContainer.appendChild(registerButton);

function updateButtonState() {
    const isFormValid = 
        nameInput.value.trim() !== "" &&
        emailInput.value.trim() !== "" &&
        passwordInput.value.trim() !== "" &&
        confirmPasswordInput.value.trim() !== "" &&
        errorCounter === 0;
    
    registerButton.disabled = !isFormValid;
}

// function validateForm() {
//     const isAnyFieldEmpty = 
//         emailInput.value === "" || 
//         nameInput.value === "" || 
//         passwordInput.value === "" || 
//         confirmPasswordInput.value === "";
    
//     const isFormValid = !isAnyFieldEmpty && errorCounter === 0;
    
//     registerButton.disabled = !isFormValid;
// }

// // Добавляем обработчики для всех полей ввода
// const inputs = [emailInput, nameInput, passwordInput, confirmPasswordInput];
// inputs.forEach(input => {
//     input.addEventListener('input', validateForm);
// });

// // Инициализируем состояние кнопки
// validateForm();



// nameInput.addEventListener("change", () => {
//     const name = nameInput.value;
//     if (!name.trim()) {
//         nameError.classList.remove("hide");
//         errorCounter++;
//         return;
//     } else {
//         nameError.classList.add("hide");
//     }
// });

// emailInput.addEventListener("change", async () => {
//     const email = emailInput.value;
//     if (email === "") {
//       emailExistError.classList.add("hide");
//       emailError.classList.add("hide");
//     } else {
//       const exists = await checkEmailExistence(email);
//       if (exists) {
//         emailExistError.classList.remove("hide");
//         errorCounter++;
//       } else {
//         emailExistError.classList.add("hide");
//       }
  
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(emailInput.value)) {
//         emailError.classList.remove("hide");
//         errorCounter++;
//       } else {
//         emailError.classList.add("hide");
//       }
//     }
//   });

// passwordInput.addEventListener("change", () => {
//     const password = passwordInput.value;
//     const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       passwordError.classList.remove("hide");
//       errorCounter++;
//       return;
//     } else {
//         passwordError.classList.add("hide");
//     }
// });

// confirmPasswordInput.addEventListener("change", () => {
//     const password = passwordInput.value;
//     const confirmPassword = confirmPasswordInput.value;
//     if (password !== confirmPassword) {
//       confirmPasswordError.classList.remove("hide");
//       errorCounter++;
//       return;
//     } else {
//         confirmPasswordError.classList.add("hide");
//     }
// });

function checkErrors() {
    errorCounter = 0; 

    if (!nameInput.value.trim()) {
        nameError.classList.remove("hide");
        errorCounter++;
    } else {
        nameError.classList.add("hide");
    }

    const email = emailInput.value.trim();
    if (email === "") {
        emailError.classList.add("hide");
        emailExistError.classList.add("hide");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            emailError.classList.remove("hide");
            errorCounter++;
        } else {
            emailError.classList.add("hide");
        }
    }

    const password = passwordInput.value;
    if (password === "") {
        passwordError.classList.add("hide");
    }  else {
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
    if (!passwordRegex.test(password)) {
        passwordError.classList.remove("hide");
        errorCounter++;
    } else {
        passwordError.classList.add("hide");
    }
}

const confirmPassword = confirmPasswordInput.value;
if (confirmPassword === "") {
    confirmPasswordError.classList.add("hide")
} else if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordError.classList.remove("hide");
        errorCounter++;
    } else {
        confirmPasswordError.classList.add("hide");
    }

    updateButtonState();
}

[nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
    input.addEventListener('change', () => {
        checkErrors();
        
        if (input === emailInput && emailInput.value.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(emailInput.value.trim())) {
                checkEmailExistence(emailInput.value.trim()).then(exists => {
                    if (exists) {
                        emailExistError.classList.remove("hide");
                        errorCounter++;
                    } else {
                        emailExistError.classList.add("hide");
                    }
                    updateButtonState();
                });
            }
        }
    });
});

  
  

const checkEmailExistence = async (email) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/check-email", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
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
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.message); 
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
  
    // if (!name.trim()) {
    //     nameError.classList.remove("hide");
    //     return;
    //   }
    
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   emailInput.addEventListener("input", () => {
    //     if (!emailRegex.test(emailInput.value)) {
    //       emailError.classList.remove("hide");  
    //     } else {
    //       emailError.classList.add("hide");  
    //     }
    //   });
  
    // const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?])[A-Za-z\d!@#$%^&*()_+{}|:"<>?]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   passwordError.classList.remove("hide");
    //   return;
    // }
  
//   if (password !== confirmPassword) {
//     confirmPasswordError.classList.remove("hide");
//     return;
//   }
  
    await registerUser(name, email, password);
  };
  
  registerButton.addEventListener('click', handleFormSubmit);
  
}