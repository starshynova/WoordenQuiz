import { API_BASE_URL, PUBLISHABLE_KEY } from '../../config.js';
import { welcomePage } from '../pages/welcomePage.js';

export const paymentForm = () => {
  document.getElementById('user-interface').innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  containerHeader.style.fontSize = '48px';
  containerHeader.textContent = 'Donate';
  container.appendChild(containerHeader);

  document.getElementById('user-interface').appendChild(container);

  const inputField = document.createElement('input');
  inputField.type = 'number';
  inputField.placeholder = 'Enter an amount in euro';
  inputField.style.width = '300px';
  container.appendChild(inputField);

  const payButton = document.createElement('button');
  payButton.textContent = 'Pay';
  payButton.style.marginTop = '40px';
  payButton.classList.add('next-button');
  payButton.style.width = '200px';
  payButton.disabled = true;
  container.appendChild(payButton);

  inputField.addEventListener('input', () => {
    if (inputField.value && parseFloat(inputField.value) > 0) {
      payButton.disabled = false;
    } else {
      payButton.disabled = true;
    }
  });

  payButton.addEventListener('click', async () => {
    inputField.classList.add('hide');
    payButton.classList.add('hide');

    const form = document.createElement('form');
    form.id = 'payment-form';
    form.classList.add('instruction-container');
    form.style.marginBottom = '40px';

    const paymentDiv = document.createElement('div');
    paymentDiv.id = 'payment-element';

    const submitButton = document.createElement('button');
    submitButton.id = 'submit';
    submitButton.classList.add('next-button');
    submitButton.style.marginTop = '40px';
    submitButton.textContent = 'Submit';

    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';

    form.appendChild(paymentDiv);
    form.appendChild(submitButton);
    form.appendChild(errorDiv);

    container.appendChild(form);

    let stripe, elements;

    async function initPayment() {
      const amountInEuro = parseFloat(inputField.value);
      const amountInCents = Math.round(amountInEuro * 100);
      const response = await fetch(`${API_BASE_URL}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents }),
      });
      const { clientSecret } = await response.json();

      stripe = Stripe(PUBLISHABLE_KEY);
      elements = stripe.elements({ clientSecret });

      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');

      const form = document.getElementById('payment-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: 'if_required',
        });

        if (error) {
          form.classList.add('hide');
          const messageContainer = document.createElement('div');
          messageContainer.classList.add('payment-message-container');
          const successMessage = document.createElement('p');
          successMessage.textContent = error.message;
          messageContainer.appendChild(successMessage);
          container.appendChild(messageContainer);
          setTimeout(() => {
            welcomePage();
          }, 3000);
        } else {
          form.classList.add('hide');
          const messageContainer = document.createElement('div');
          messageContainer.classList.add('payment-message-container');
          const successMessage = document.createElement('p');
          successMessage.textContent = 'Payment successful!';
          messageContainer.appendChild(successMessage);
          container.appendChild(messageContainer);
          setTimeout(() => {
            welcomePage();
          }, 5000);
        }
      });
    }
    initPayment();
  });
};
