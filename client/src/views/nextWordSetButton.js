import { getWord } from "../pages/getWord.js";

// export const nextWordSetPage = () => {
// document.getElementById("user-interface").innerHTML = "";
// const container = document.createElement("div");
// const nextWordSetButton = document.createElement("button");
// nextWordSetButton.textContent = "Next 10 word ";
// nextWordSetButton.classList.add("next-button");
// document.getElementById("user-interface").appendChild(container);
// container.appendChild(nextWordSetButton);

// const setUpdatedCollections = async (data) => {
//   try {
//     await fetch('http://localhost:3000/api/word/update-words', {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//   } catch (error) {
//     console.error("Error when updating collections:", error);
//   }
// }

// const clearCollections = async () => {
//   try {
//     await fetch('http://localhost:3000/api/word/clear-collections', {
//       method: "DELETE",
//     });
//   } catch (error) {
//     console.error("Error when clearing collections:", error);
//   }
// };

//   nextWordSetButton.addEventListener("click", async () => {
//   await setUpdatedCollections();
//   await clearCollections();

//   document.getElementById("user-interface").innerHTML = "";
//   await getWord();
// });
// };


export const nextWordSetPage = () => {
  document.getElementById("user-interface").innerHTML = "";

  const container = document.createElement("div");
  container.classList.add("set-finished");

  const message = document.createElement("p");
  message.textContent = "You’ve finished this set!";
  message.classList.add("set-message");

  const nextWordSetButton = document.createElement("button");
  nextWordSetButton.textContent = "Next 10 words";
  nextWordSetButton.classList.add("next-button");

  container.appendChild(message);
  container.appendChild(nextWordSetButton);
  document.getElementById("user-interface").appendChild(container);

  // nextWordSetButton.addEventListener("click", async () => {
  //   await setUpdatedCollections(); // эти функции уже у тебя есть
  //   await clearCollections();

  //   document.getElementById("user-interface").innerHTML = "";
  //   await getWord(); // теперь запускаем новый набор слов
  // });
};




