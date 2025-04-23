import { getWord } from "../pages/getWord.js";
import { currentWordId, currentStage, currentCounter, getIncorrectAnswer } from "../pages/getWord.js";
import { nextWordSetPage } from "./nextWordSetButton.js";

export const nextButton = document.createElement("button");

nextButton.classList.add("next-button");

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

export const nextWord = async () => {
  let updateData = {};

  if (currentStage < 8) {
    updateData.stage = currentStage + 1;

    if (getIncorrectAnswer?.() === true) {
      updateData.counter = currentCounter + 1;
    }

  } else if (currentStage === 8) {
nextWordSetPage();
  }

  await setUpdateData(updateData);

  document.getElementById("user-interface").innerHTML = "";
  getWord();
}

nextButton.addEventListener("click", nextWord
//   let updateData = {};

//   if (currentStage < 8) {
//     updateData.stage = currentStage + 1;

//     if (getIncorrectAnswer?.() === true) {
//       updateData.counter = currentCounter + 1;
//       console.log("current counter for word", updateData.counter)
//     }

//   } else if (currentStage === 8) {
// nextWordSetPage();
//   }
    
  

//   await setUpdateData(updateData);

//   document.getElementById("user-interface").innerHTML = "";
//   getWord();
);
