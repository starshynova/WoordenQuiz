import { currentWordId, currentStage, currentCounter, getIncorrectAnswer } from "../pages/getWord.js";
import { nextWordSetPage } from "./nextWordSetButton.js";

export const finishSetButton = document.createElement("button");
finishSetButton.textContent = "Finish this set";
finishSetButton.classList.add("hide");
finishSetButton.disabled = true;

const setUpdateData = async (data) => {
  try {
    await fetch(`http://localhost:3000/api/word/${currentWordId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error when updating a word:", error);
  }
};

finishSetButton.addEventListener("click", async () => {
  let updateData = {};

    updateData.stage = currentStage + 1;

    if (getIncorrectAnswer?.() === true) {
      updateData.counter = currentCounter + 1;
    }

  await setUpdateData(updateData);

  document.getElementById("user-interface").innerHTML = "";
    nextWordSetPage();
});
