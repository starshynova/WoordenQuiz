import { getWord } from "../pages/getWord.js";
import { currentWordId } from "../pages/getWord.js";
import { currentStage } from "../pages/getWord.js";
import { getIncorrectAnswer } from "../pages/getWord.js";
import { currentCounter } from "../pages/getWord.js";

export const nextButton = document.createElement("button");
nextButton.textContent = "Next word";
nextButton.className = "next-button";

nextButton.addEventListener("click", async () => {
  const updateData = { stage: currentStage + 1 };

  if (getIncorrectAnswer && getIncorrectAnswer()) {
    updateData.counter = currentCounter + 1;
  }
  try {
    await fetch(`http://localhost:3000/api/word/${currentWordId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  } catch (error) {
    console.error("Error when updating a word:", error);
  }

  document.getElementById("user-interface").innerHTML = "";

  getWord();
});
