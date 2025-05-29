import { API_BASE_URL, PUBLISHABLE_KEY } from "../../config.js";
import { welcomePage } from "./welcomePage.js";


export const payment = () => {
    document.getElementById('user-interface').innerHTML = '';

    const container = document.createElement('div');
    container.classList.add('container');
    const containerHeader = document.createElement('div');
    containerHeader.classList.add('container-header');
    containerHeader.style.fontSize = "48px";
    containerHeader.textContent = 'Donate';
    container.appendChild(containerHeader);
    
    document.getElementById('user-interface').appendChild(container);

    const inputField = document.createElement('input');
    inputField.type = "number";
    inputField.placeholder = "Enter an amount in euro";
    inputField.style.width = "400px";
    container.appendChild(inputField);

    const payButton = document.createElement('button');
    payButton.textContent = "Pay";
    payButton.classList.add('next-button');
    payButton.style.width = "200px";
    container.appendChild(payButton);

    payButton.addEventListener('click', async () => {
    //   const amountInEuro = parseFloat(inputField.value);
    //   const amountInCents = Math.round(amountInEuro * 100);

    //   const res = await fetch(`${API_BASE_URL}/api/payment`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ amount: amountInCents }),
    //   });

    //   const data = await res.json();
    //   if (data.url) {
    //     window.location.href = data.url;
    //   } else {
    //     alert('Error creating a payment session');
    //   }
    // });

    inputField.classList.add('hide');
    payButton.classList.add('hide');

    const form = document.createElement('form');
    form.id = 'payment-form';   

    const paymentDiv = document.createElement('div');
    paymentDiv.id = 'payment-element';  

    const button = document.createElement('button');
    button.id = 'submit';
    button.textContent = 'Оплатить';    

    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';  

    form.appendChild(paymentDiv);
    form.appendChild(button);
    form.appendChild(errorDiv); 

    container.appendChild(form);


    let stripe, elements;

    async function initPayment() {
      const amountInEuro = parseFloat(inputField.value);
      const amountInCents = Math.round(amountInEuro * 100);
      const response = await fetch(`${API_BASE_URL}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents }) 
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
            form.innerHTML = '';
            const successmessge = document.createElement('p');
            successmessge.textContent = error.message;
            container.appendChild(successmessge);
            setTimeout(() => {
                welcomePage();
            }, 5000)
        } else {
            form.innerHTML = '';
            const successmessge = document.createElement('p');
            successmessge.textContent = "Payment successful!";
            container.appendChild(successmessge);
            setTimeout(() => {
                welcomePage();
            }, 5000)
        }
      });
    };
    initPayment();
})
}

