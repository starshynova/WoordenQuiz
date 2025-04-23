import { getWord } from "../pages/getWord.js";

export const nextWordSetPage = () => {
const container = document.createElement("div");
const nextWordSetButton = document.createElement("button");
nextWordSetButton.textContent = "Next 10 word ";
nextWordSetButton.classList.add("next-button");
document.getElementById("user-interface").appendChild(container);
container.appendChild(nextWordSetButton);

const setUpdatedCollections = async (data) => {
  try {
    await fetch('http://localhost:3000/api/update-words', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error when updating collections:", error);
  }
}

const clearCollections = async () => {
  try {
    await fetch('http://localhost:3000/api/clear-collections', {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error when clearing collections:", error);
  }
};

  nextWordSetButton.addEventListener("click", async () => {
  await setUpdatedCollections();
  await clearCollections();

  document.getElementById("user-interface").innerHTML = "";
  await getWord();
});
};



