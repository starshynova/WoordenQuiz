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
}