import { API_BASE_URL } from "../../config.js";
import { backIconContainer } from "../views/backButton.js";
import { welcomePage } from "./welcomePage.js";
import { messageView } from "../views/messageView.js";

export const categoryPage = async () => {
 document.getElementById('user-interface').innerHTML = '';
  backIconContainer.addEventListener('click', () => {
    welcomePage();
  });

const container = document.createElement('div');
  container.classList.add('container');
  const containerHeader = document.createElement('div');
  containerHeader.classList.add('container-header');
  containerHeader.style.fontSize = '36px';
  containerHeader.textContent = 'Categories';
  container.appendChild(containerHeader);
  document.getElementById('user-interface').appendChild(container);
  document.getElementById('user-interface').appendChild(backIconContainer);

  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('instruction-container');
  container.appendChild(categoryContainer);

  try {
    const response = await fetch(`${API_BASE_URL}/api/word/category`);
    const categories = await response.json();

    if (categories.length === 0) {
      messageView("No one category");
      return;
    }

    const ul = document.createElement('ul');
    categories.forEach(cat => {
      const li = document.createElement('li');
      li.textContent = cat;
      ul.appendChild(li);
    });

    categoryContainer.appendChild(ul);
  } catch (error) {
    messageView("Error loading categories");
    console.error("categories error:", error);
  }
}
