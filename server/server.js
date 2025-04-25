import express from "express";
// import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import woordenRouter from "./routes/woorden.js";
import userRouter from "./routes/users.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/word", woordenRouter);
app.use("/api/user", userRouter);

dotenv.config();

const PORT = process.env.PORT;
// const client = new MongoClient(process.env.MONGODB_URL, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const db = client.db("WoordenQuiz");
// const woorden = db.collection("woorden");
// const activeWoorden = db.collection("active_woorden");


// app.get("/api/word", async (req, res) => {
//   try {
//     const lengthActiveWoorden = await activeWoorden.countDocuments();

//     if (lengthActiveWoorden === 0) {
//       const newWords = await woorden
//   .find({ status: "new", stage: 0 })
//   .limit(10)
//   .toArray();

// const familiarWords = await woorden
//   .find({ status: "familiar" })
//   .limit(5)
//   .toArray();

// const temporaryWoorden = [...newWords, ...familiarWords];

//       if (!temporaryWoorden) {
//         return res.status(404).json({ error: "No new words found" });
//       }

//       await activeWoorden.insertMany(
//         temporaryWoorden.map((word) => ({
//           wordId: word._id,
//           front: word.front,
//           back: word.back,
//           status: word.status,
//           counter: word.counter,
//           stage: word.stage,
//         })),
//       );
//     }
//     const nextWord = await activeWoorden
//       .find()
//       .sort({ stage: 1, updatedAt: 1 })
//       .limit(1)
//       .toArray();
//     if (!nextWord) {
//       return res.status(404).json({ error: "No word found" });
//     }

//     const totalWordsWithStage = await activeWoorden.countDocuments({ stage: nextWord[0].stage });
//     res.json({
//       word: nextWord[0],
//       totalWordsWithStage: totalWordsWithStage, 
//     });
//   } catch (error) {
//     console.error("Error fetching word:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/api/active-word", async (req, res) => {
//   try {
//     const word = await activeWoorden
//       .find()
//       .sort({ stage: 1 })
//       .limit(1)
//       .toArray();

//     if (!word) {
//       return res.status(404).json({ error: "No word found" });
//     }
//     res.json(word[0]);
//   } catch (error) {
//     console.error("Error fetching word:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.put("/api/word/:id", async (req, res) => {
//   try {
//     const wordId = req.params.id;
//     const updateData = req.body;

//     if (updateData.counter === undefined && updateData.stage === undefined) {
//       return res
//         .status(400)
//         .json({ error: "Both 'counter' and 'stage' are missing" });
//     }

//     const updateFields = {};
//     if (updateData.counter !== undefined) updateFields.counter = updateData.counter;
//     if (updateData.stage !== undefined) updateFields.stage = updateData.stage;

//     const result = await activeWoorden.updateOne(
//     { _id: new ObjectId(wordId) },
//     { $set: updateFields }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).json({ error: "Word not updated" });
//     }

//     res.json({ message: "Word updated successfully" });
//   } catch (error) {
//     console.error("Error updating word:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.put("/api/update-words", async (req, res) => {
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
// });


// app.get("/api/quiz-two/:id", async (req, res) => {
//   try {
//     const wordId = new ObjectId(req.params.id);

//     const currentWord = await activeWoorden.findOne({ _id: wordId });
//     if (!currentWord) {
//       return res.status(404).json({ error: "Word not found" });
//     }

//     const otherWords = await activeWoorden
//       .aggregate([
//         { $match: { _id: { $ne: wordId } } },
//         { $sample: { size: 1 } },
//       ])
//       .toArray();

//     if (otherWords.length === 0) {
//       return res.status(404).json({ error: "No alternative word found" });
//     }

//     const wrongBack = otherWords[0].back;

//     const options = [currentWord.back, wrongBack].sort(
//       () => Math.random() - 0.5,
//     );

//     res.json({
//       question: currentWord.front,
//       options,
//       correctAnswer: currentWord.back,
//       wordId: currentWord._id,
//     });
//   } catch (error) {
//     console.error("Error generating quiz:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/api/quiz-four/:id", async (req, res) => {
//   try {
//     const wordId = new ObjectId(req.params.id);
//     const direction = req.query.direction || 'front-to-back';

//     const currentWord = await activeWoorden.findOne({ _id: wordId });
//     if (!currentWord) {
//       return res.status(404).json({ error: "Word not found" });
//     }

//     const wrongAnswers = await activeWoorden
//       .aggregate([
//         { $match: { _id: { $ne: wordId } } },
//         { $sample: { size: 3 } },
//       ])
//       .toArray();

//     if (wrongAnswers.length < 3) {
//       return res.status(404).json({ error: "Not enough alternative words" });
//     };

//     const questionField = direction === 'front-to-back' ? 'front' : 'back';
//     const answerField = direction === 'front-to-back' ? 'back' : 'front';

//     const incorrectOptions = wrongAnswers.map((word) => word[answerField]);
//     const correctAnswer = currentWord[answerField];

//     const options = [correctAnswer, ...incorrectOptions].sort(
//       () => Math.random() - 0.5,
//     );

//     res.json({
//       question: currentWord[questionField],
//       options,
//       correctAnswer,
//       wordId: currentWord._id,
//     });
//   } catch (error) {
//     console.error("Error generating quiz:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.delete("/api/clear-collections", async (req, res) => {
//   try {

//     await activeWoorden.deleteMany();

//     res.json({
//       message: "Documents deleted successfully from both collections",
//     });
//   } catch (error) {
//     console.error("Error deleting documents:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





// import express from "express";

// import userRouter from "./routes/user.js";
// import wordRouter from "./routes/woorden.js";

// // Create an express server
// const app = express();

// // Tell express to use the json middleware
// app.use(express.json());

// /****** Attach routes ******/
// /**
//  * We use /api/ at the start of every route!
//  * As we also host our client code on heroku we want to separate the API endpoints.
//  */
// app.use("/api/user", userRouter);
// app.use("/api/word", wordRouter);

// export default app;