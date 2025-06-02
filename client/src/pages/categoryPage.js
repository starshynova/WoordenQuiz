import { API_BASE_URL } from "../../config.js";
import { backIconContainer } from "../views/backButton.js";
import { welcomePage } from "./welcomePage.js";
import { messageView } from "../views/messageView.js";
import jwtDecode from 'https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/+esm';
import { getWord } from "./getWord.js";

let userId;

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
  categoryContainer.classList.add('category-container');
  container.appendChild(categoryContainer);

  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return messageView('You are not logged in. Please log in to continue.');
    }

    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;

    const response = await fetch(`${API_BASE_URL}/api/category`);
    const categories = await response.json();

    if (categories.length === 0) {
      return messageView("No categories found");
    }

    categories.sort((a, b) => a.category - b.category);
    console.log("Categories:", categories);

    categories.forEach((cat) => {
      const categoryButton = document.createElement('button');
      categoryButton.textContent = cat.categoryName;
      categoryButton.classList.add('category-button');
      categoryContainer.appendChild(categoryButton);

      categoryButton.addEventListener('click', async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/category/${userId}/category`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: cat.category }),
          });

          const data = await res.json();

          if (!res.ok) {
            messageView(data.error || 'Failed to set category');
          } else {
            getWord();
            console.log('The category is set:', data);
          }
        } catch (error) {
          console.error('Error when setting a category:', error);
          messageView('Error when selecting a category');
        }
      });
    });
  } catch (error) {
    console.error('Error loading categories:', error);
    messageView("Error loading categories");
  }
};
