import db from "../db/connectDB.js";
import { ObjectId } from "mongodb";

const { woorden, activeWoorden, users } = db;


export const getWords = async (req, res) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await users.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userWords = user.words || [];
    const wordStatusNew = userWords.filter(word => word.status === "new");
    const newWordsAmount = 10 - wordStatusNew.length;

    let updatedWords = [...userWords];

    if (newWordsAmount > 0) {
      let lastNewWord = wordStatusNew[wordStatusNew.length - 1];
      let query = {};

      if (lastNewWord && lastNewWord._id) {
        query = { _id: { $gt: new ObjectId(lastNewWord._id) } };
      }

      const newWords = await woorden
        .find(query)
        .sort({ $natural: 1 })
        // .sort({ _id: 1 }) 
        .limit(newWordsAmount)
        .project({ _id: 1 })
        .toArray();

      newWords.forEach(word => {
        word.status = "new";
        word.counter = 0;
        word.stage = 0;
      });

      // updatedWords = [...userWords, ...newWords];
      updatedWords = [
        ...userWords,
        ...newWords.map(word => ({
          ...word,
          status: "new",
          counter: 0,
          stage: 0
        }))
      ];

      await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { words: updatedWords } }
      );
    }

    const updatedUser = await users.findOne({ _id: new ObjectId(id) });

    const nextWord = updatedUser.words
      .filter(word => word.status === "new" || word.status === "familiar")
      .sort((a, b) => a.stage - b.stage)[0];

    if (!nextWord) {
      return res.status(404).json({ error: "No word found" });
    }

    const frontBack = await woorden.findOne({ _id: new ObjectId(nextWord._id) });
    if (!frontBack) {
      return res.status(404).json({ error: "Word data not found in woorden collection" });
    }

    nextWord.front = frontBack.front;
    nextWord.back = frontBack.back;

    // const totalWordsWithStageNew = updatedUser.words
    // .filter(
    //   word =>
    //     (word.status === "new" || word.status === "familiar") &&
    //     word.stage === nextWord.stage
    // )
    // .slice(0, 15).length;

    // const totalWordsWithStage = updatedUser.words.filter(
    //   word => word.status === "new" 
    //   && word.status === "familiar"
    //   && word.stage === nextWord.stage
    // ).length;

    // return res.json({
    //   word: nextWord,
    //   totalWordsWithStageNew: totalWordsWithStageNew,
    // });

    const totalWordsWithStageNew = updatedUser.words.filter(
  word => word.status === "new" && word.stage === nextWord.stage
);

let totalWordsWithStage = [...totalWordsWithStageNew];

if (nextWord.stage >= 5) {
  const familiarWords = updatedUser.words.filter(
    word => word.status === "familiar" && word.stage === nextWord.stage
  );

  const slotsLeft = 15 - totalWordsWithStage.length;
  if (slotsLeft > 0) {
    totalWordsWithStage = totalWordsWithStage.concat(familiarWords.slice(0, slotsLeft));
  }
}

res.json({
  word: nextWord,
  totalWordsWithStageNew: totalWordsWithStageNew.length,
  totalWordsWithStage: totalWordsWithStage.length,
});


  } catch (error) {
    console.error("Error fetching word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const getActiveWord = async (req, res) => {
    try {
      const word = await activeWoorden
        .find()
        .sort({ stage: 1 })
        .limit(1)
        .toArray();
  
      if (!word) {
        return res.status(404).json({ error: "No word found" });
      }
      res.json(word[0]);
    } catch (error) {
      console.error("Error fetching word:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };


export const updateWord = async (req, res) => {
  try {
    const { userId, wordId } = req.params;
    const updateData = req.body;

    if (updateData.counter === undefined && updateData.stage === undefined) {
      return res
        .status(400)
        .json({ error: "Both 'counter' and 'stage' are missing" });
    }

    const updateFields = {};
    if (updateData.counter !== undefined) updateFields["words.$[elem].counter"] = updateData.counter;
    if (updateData.stage !== undefined) updateFields["words.$[elem].stage"] = updateData.stage;

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      {
        arrayFilters: [{ "elem._id": new ObjectId(wordId) }],
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Word not updated" });
    }

    res.json({ message: "Word updated successfully" });
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


  // export const updateWords = async (req, res) => {
  //   try {
  //     const updatedActiveWoorden = await activeWoorden.find().toArray();
  
  //     const processWord = async (word) => {
  //       let updatedData = {
  //         status: word.status,
  //         counter: word.counter,
  //         stage: word.stage,
  //       };
  
  //       if (word.counter === 0 || word.counter === 1) {
  //         updatedData.status = "learned";
  //       } else if (word.counter === 2 || word.counter === 3) {
  //         updatedData.status = "familiar";
  //         updatedData.counter = 0;
  //         updatedData.stage = 5;
  //       } else if (word.counter === 4 || word.counter === 5) {
  //         updatedData.counter = 0;
  //         updatedData.stage = 0;
  //       }
        
  //       await woorden.updateOne(
  //         { _id: word.wordId },
  //         { $set: updatedData },
  //       );
  //     };
  
  //     for (const word of updatedActiveWoorden) {
  //       await processWord(word);
  //     }
  
  //     res.json({ message: "Words updated successfully" });
  //   } catch (error) {
  //     console.error("Error updating words:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // };

  export const updateWords = async (req, res) => {
  try {
    const userId = req.params.userId; 
    if (!userId) return res.status(400).json({ error: "Missing user ID" });

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user || !user.words) {
      return res.status(404).json({ error: "User or words not found" });
    }

    const updatedWords = user.words.map((word) => {
      if (word.status !== "new") return word;

      let updatedData = { ...word };

      if (word.counter === 0 || word.counter === 1) {
        updatedData.status = "learned";
      } else if (word.counter === 2 || word.counter === 3) {
        updatedData.status = "familiar";
        updatedData.counter = 0;
        updatedData.stage = 5;
      } else if (word.counter === 4 || word.counter === 5) {
        updatedData.status = "new";
        updatedData.counter = 0;
        updatedData.stage = 0;
      }

      return updatedData;
    });

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { words: updatedWords } }
    );

    res.json({ message: "User words updated successfully" });
  } catch (error) {
    console.error("Error updating user words:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    export const getQuizTwo = async (req, res) => {
      try {
        const { userId, wordId } = req.params;
    
        const user = await users.findOne({ _id: new ObjectId(userId) });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        const wordEntry = user.words.find(word => word._id.toString() === wordId);
        if (!wordEntry) {
          return res.status(404).json({ error: "Word not found in user's list" });
        }
    
        const currentWord = await woorden.findOne({ _id: new ObjectId(wordId) });
        if (!currentWord) {
          return res.status(404).json({ error: "Word not found in woorden collection" });
        }
    
        const suitableWordIds = user.words
          .filter(w => w.status === 'new' && w._id.toString() !== wordId)
          .map(w => new ObjectId(w._id));
    
        if (suitableWordIds.length < 1) {
          return res.status(404).json({ error: "Not enough alternative words with status 'new'" });
        }
    
        const [wrongWord] = await woorden
          .aggregate([
            { $match: { _id: { $in: suitableWordIds } } },
            { $sample: { size: 1 } },
          ])
          .toArray();
    
        const options = [currentWord.back, wrongWord.back].sort(() => Math.random() - 0.5);
    
        res.json({
          question: currentWord.front,
          options,
          correctAnswer: currentWord.back,
          wordId: currentWord._id,
        });
      } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };
    
        export const getQuizFour = async (req, res) => {
          try {
            const { userId, wordId } = req.params;
            const direction = req.query.direction || 'front-to-back';
        
            const user = await users.findOne({ _id: new ObjectId(userId) });
            if (!user) {
              return res.status(404).json({ error: "User not found" });
            }
        
            const wordEntry = user.words.find(word => word._id.toString() === wordId);
            if (!wordEntry) {
              return res.status(404).json({ error: "Word not found in user's list" });
            }
        
            const currentWord = await woorden.findOne({ _id: new ObjectId(wordId) });
            if (!currentWord) {
              return res.status(404).json({ error: "Word not found in woorden collection" });
            }
        
            const suitableWordIds = user.words
              .filter(w => w.status === 'new' && w._id.toString() !== wordId)
              .map(w => new ObjectId(w._id));
        
            if (suitableWordIds.length < 3) {
              return res.status(404).json({ error: "Not enough alternative words with status 'new'" });
            }
        
            const wrongAnswers = await woorden
              .aggregate([
                { $match: { _id: { $in: suitableWordIds } } },
                { $sample: { size: 3 } },
              ])
              .toArray();
        
            const questionField = direction === 'front-to-back' ? 'front' : 'back';
            const answerField = direction === 'front-to-back' ? 'back' : 'front';
        
            const incorrectOptions = wrongAnswers.map(word => word[answerField]);
            const correctAnswer = currentWord[answerField];
        
            const options = [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5);
        
            res.json({
              question: currentWord[questionField],
              options,
              correctAnswer,
              wordId: currentWord._id,
            });
          } catch (error) {
            console.error("Error generating quiz:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        };
        
    
    export const clearCollection = async (req, res) => {
        try {
      
          await activeWoorden.deleteMany();
      
          res.json({
            message: "Documents deleted successfully from both collections",
          });
        } catch (error) {
          console.error("Error deleting documents:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      };





// app.get("/api/word", async (req, res) => {
//     try {
//       const lengthActiveWoorden = await activeWoorden.countDocuments();
  
//       if (lengthActiveWoorden === 0) {
//         const newWords = await woorden
//     .find({ status: "new", stage: 0 })
//     .limit(10)
//     .toArray();
  
//   const familiarWords = await woorden
//     .find({ status: "familiar" })
//     .limit(5)
//     .toArray();
  
//   const temporaryWoorden = [...newWords, ...familiarWords];
  
//         if (!temporaryWoorden) {
//           return res.status(404).json({ error: "No new words found" });
//         }
  
//         await activeWoorden.insertMany(
//           temporaryWoorden.map((word) => ({
//             wordId: word._id,
//             front: word.front,
//             back: word.back,
//             status: word.status,
//             counter: word.counter,
//             stage: word.stage,
//           })),
//         );
//       }
//       const nextWord = await activeWoorden
//         .find()
//         .sort({ stage: 1, updatedAt: 1 })
//         .limit(1)
//         .toArray();
//       if (!nextWord) {
//         return res.status(404).json({ error: "No word found" });
//       }
  
//       const totalWordsWithStageNew = await activeWoorden.countDocuments({ stage: nextWord[0].stage });
//       res.json({
//         word: nextWord[0],
//         totalWordsWithStageNew: totalWordsWithStageNew, 
//       });
//     } catch (error) {
//       console.error("Error fetching word:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  
//   app.get("/api/active-word", async (req, res) => {
//     try {
//       const word = await activeWoorden
//         .find()
//         .sort({ stage: 1 })
//         .limit(1)
//         .toArray();
  
//       if (!word) {
//         return res.status(404).json({ error: "No word found" });
//       }
//       res.json(word[0]);
//     } catch (error) {
//       console.error("Error fetching word:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  
//   app.put("/api/word/:id", async (req, res) => {
//     try {
//       const wordId = req.params.id;
//       const updateData = req.body;
  
//       if (updateData.counter === undefined && updateData.stage === undefined) {
//         return res
//           .status(400)
//           .json({ error: "Both 'counter' and 'stage' are missing" });
//       }
  
//       const updateFields = {};
//       if (updateData.counter !== undefined) updateFields.counter = updateData.counter;
//       if (updateData.stage !== undefined) updateFields.stage = updateData.stage;
  
//       const result = await activeWoorden.updateOne(
//       { _id: new ObjectId(wordId) },
//       { $set: updateFields }
//       );
  
//       if (result.modifiedCount === 0) {
//         return res.status(404).json({ error: "Word not updated" });
//       }
  
//       res.json({ message: "Word updated successfully" });
//     } catch (error) {
//       console.error("Error updating word:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  
//   app.put("/api/update-words", async (req, res) => {
//     try {
//       const updatedActiveWoorden = await activeWoorden.find().toArray();
  
//       const processWord = async (word) => {
//         let updatedData = {
//           status: word.status,
//           counter: word.counter,
//           stage: word.stage,
//         };
  
//         if (word.counter === 0 || word.counter === 1) {
//           updatedData.status = "learned";
//         } else if (word.counter === 2 || word.counter === 3) {
//           updatedData.status = "familiar";
//           updatedData.counter = 0;
//           updatedData.stage = 5;
//         } else if (word.counter === 4 || word.counter === 5) {
//           updatedData.counter = 0;
//           updatedData.stage = 0;
//         }
        
//         await woorden.updateOne(
//           { _id: word.wordId },
//           { $set: updatedData },
//         );
//       };
  
//       for (const word of updatedActiveWoorden) {
//         await processWord(word);
//       }
  
//       res.json({ message: "Words updated successfully" });
//     } catch (error) {
//       console.error("Error updating words:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  
  
//   app.get("/api/quiz-two/:id", async (req, res) => {
//     try {
//       const wordId = new ObjectId(req.params.id);
  
//       const currentWord = await activeWoorden.findOne({ _id: wordId });
//       if (!currentWord) {
//         return res.status(404).json({ error: "Word not found" });
//       }
  
//       const otherWords = await activeWoorden
//         .aggregate([
//           { $match: { _id: { $ne: wordId } } },
//           { $sample: { size: 1 } },
//         ])
//         .toArray();
  
//       if (otherWords.length === 0) {
//         return res.status(404).json({ error: "No alternative word found" });
//       }
  
//       const wrongBack = otherWords[0].back;
  
//       const options = [currentWord.back, wrongBack].sort(
//         () => Math.random() - 0.5,
//       );
  
//       res.json({
//         question: currentWord.front,
//         options,
//         correctAnswer: currentWord.back,
//         wordId: currentWord._id,
//       });
//     } catch (error) {
//       console.error("Error generating quiz:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  
//   app.get("/api/quiz-four/:id", async (req, res) => {
//     try {
//       const wordId = new ObjectId(req.params.id);
//       const direction = req.query.direction || 'front-to-back';
  
//       const currentWord = await activeWoorden.findOne({ _id: wordId });
//       if (!currentWord) {
//         return res.status(404).json({ error: "Word not found" });
//       }
  
//       const wrongAnswers = await activeWoorden
//         .aggregate([
//           { $match: { _id: { $ne: wordId } } },
//           { $sample: { size: 3 } },
//         ])
//         .toArray();
  
//       if (wrongAnswers.length < 3) {
//         return res.status(404).json({ error: "Not enough alternative words" });
//       };
  
//       const questionField = direction === 'front-to-back' ? 'front' : 'back';
//       const answerField = direction === 'front-to-back' ? 'back' : 'front';
  
//       const incorrectOptions = wrongAnswers.map((word) => word[answerField]);
//       const correctAnswer = currentWord[answerField];
  
//       const options = [correctAnswer, ...incorrectOptions].sort(
//         () => Math.random() - 0.5,
//       );
  
//       res.json({
//         question: currentWord[questionField],
//         options,
//         correctAnswer,
//         wordId: currentWord._id,
//       });
//     } catch (error) {
//       console.error("Error generating quiz:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  
//   app.delete("/api/clear-collections", async (req, res) => {
//     try {
  
//       await activeWoorden.deleteMany();
  
//       res.json({
//         message: "Documents deleted successfully from both collections",
//       });
//     } catch (error) {
//       console.error("Error deleting documents:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });