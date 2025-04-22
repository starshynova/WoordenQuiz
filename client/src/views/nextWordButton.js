import { getWord } from "../pages/getWord.js";
import { currentWordId, currentStage, currentCounter, getIncorrectAnswer, stageCounters } from "../pages/getWord.js";
import { nextWordSetPage } from "./nextWordSetButton.js";

export const nextButton = document.createElement("button");

nextButton.classList.add("next-button");
// nextButton.disabled = true;

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


nextButton.addEventListener("click", async () => {
  let updateData = {};

  if (currentStage < 8) {
    updateData.stage = currentStage + 1;

    if (getIncorrectAnswer?.() === true) {
      updateData.counter = currentCounter + 1;
      console.log("current counter for word", updateData.counter)
    }

    // if (currentCounter <= 1) {
    //   updateData = { status: "learned" };
    // } else if (currentCounter > 1 && currentCounter < 4) {
    //   updateData = { status: "familiar", counter: 0, stage: 5 };
    // } else if (currentCounter >= 4) {
    //   updateData = { status: "new", counter: 0, stage: 0 };
    // }

  } else if (currentStage === 8) {
nextWordSetPage();
  }
    
  

  await setUpdateData(updateData);

  document.getElementById("user-interface").innerHTML = "";
  getWord();
});
