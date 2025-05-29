import { paymentForm } from '../views/paynemtForm.js';

export const payment = () => {
  document.getElementById('user-interface').innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  containerHeader.style.fontSize = '48px';
  containerHeader.textContent = 'Donate';
  container.appendChild(containerHeader);

  document.getElementById('user-interface').appendChild(container);

  const warningMessageContainer = document.createElement('div');
  warningMessageContainer.classList.add('payment-message-container');
  container.appendChild(warningMessageContainer);

  const warningMessage = document.createElement('p');
  warningMessage.style.whiteSpace = 'pre-line';
  warningMessage.textContent =
    'You are in a test payment mode.\nPayment data will not be processed for real.\nYou can use test cards or data provided by Stripe to try the payment.';

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '20px';

  const createCell = (text, isHeader = false) => {
    const cell = isHeader
      ? document.createElement('th')
      : document.createElement('td');
    cell.textContent = text;
    cell.style.border = '1px solid black';
    cell.style.padding = '8px 12px';
    return cell;
  };

  const headerRow = document.createElement('tr');
  ['Scenario', 'Card', 'Date', 'CVC'].forEach((text) => {
    headerRow.appendChild(createCell(text, true));
  });
  table.appendChild(headerRow);

  const data = [
    [
      'Successful payment',
      '4242 4242 4242 4242',
      'Any future date',
      'Any 3 digits',
    ],
    [
      'Declined payments',
      '4000 0000 0000 9995',
      'Any future date',
      'Any 3 digits',
    ],
  ];

  data.forEach((rowData) => {
    const row = document.createElement('tr');
    rowData.forEach((cellText) => {
      row.appendChild(createCell(cellText));
    });
    table.appendChild(row);
  });

  warningMessageContainer.appendChild(warningMessage);
  warningMessageContainer.appendChild(table);

  const continuePaymentButton = document.createElement('button');
  continuePaymentButton.classList.add('next-button');
  continuePaymentButton.style.marginTop = '40px';
  continuePaymentButton.textContent = 'Ok, continue test payment';
  warningMessageContainer.appendChild(continuePaymentButton);

  continuePaymentButton.addEventListener('click', paymentForm);
};
