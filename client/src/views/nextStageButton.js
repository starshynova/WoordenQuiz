import { getWord } from "../pages/getWord.js";
import { currentWordId, currentStage, currentCounter, getIncorrectAnswer } from "../pages/getWord.js";

export const nextStageButton = document.createElement("button");
nextStageButton.textContent = "Next stage";
nextStageButton.className = "next-button";

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

// const setUpdatedCollections = async (data) => {
//   try {
//     await fetch('http://localhost:3000/api/update-words', {
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
//     await fetch('http://localhost:3000/api/clear-collections')
//   } catch (error) {
//     console.error("Error when clearing collections:", error);
//   }
// };

nextStageButton.addEventListener("click", async () => {
  let updateData = {};

  // if (currentStage < 8) {
    updateData.stage = currentStage + 1;

    if (getIncorrectAnswer?.() === true) {
      updateData.counter = currentCounter + 1;
    }

  // } else if (currentStage === 8) {
  //   if (currentCounter <= 1) {
  //     updateData = { status: "learned" };
  //   } else if (currentCounter > 1 && currentCounter < 4) {
  //     updateData = { status: "familiar", counter: 0, stage: 5 };
  //   } else if (currentCounter >= 4) {
  //     updateData = { status: "new", counter: 0, stage: 0 };
  //   }
  // }

  await setUpdateData(updateData);
  await setUpdatedCollections();
  await clearCollections();

  document.getElementById("user-interface").innerHTML = "";
  getWord();
});
