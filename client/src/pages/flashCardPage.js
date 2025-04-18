import { renderSingleCard } from "../views/flashCardView.js";

export let currentWordId = 0;
export async function getWord() {
  try {
    const response = await fetch("http://localhost:3000/api/word");
    const word = await response.json();
    currentWordId = word._id;
    console.log("Word:", word);
    renderSingleCard(word);
  } catch (error) {
    console.error("Error getting word:", error);
  }
}

//   document.addEventListener('DOMContentLoaded', () => {
//     getWord();
//   });

//   export { getWord };
