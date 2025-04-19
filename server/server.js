import express from "express";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(cors());

dotenv.config();
// const PORT = process.env.PORT;
const PORT = 3000;
const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("WoordenQuiz");
const woorden = db.collection("woorden");
const activeWoorden = db.collection("active_woorden");
const repeatWoorden = db.collection("repeat_woorden");

app.use(express.json());

app.get("/api/word", async (req, res) => {
  try {
    const lengthActiveWoorden = await activeWoorden.countDocuments();

    if (lengthActiveWoorden === 0) {
      const temporaryWoorden = await woorden
        .find({ status: "new", stage: 0 })
        .limit(10)
        .toArray();

      if (!temporaryWoorden) {
        return res.status(404).json({ error: "No new words found" });
      }

      await activeWoorden.insertMany(
        temporaryWoorden.map((word) => ({
          wordId: word._id,
          front: word.front,
          back: word.back,
          status: word.status,
          counter: word.counter,
          stage: word.stage,
        })),
      );
    }
    const nextWord = await activeWoorden
      .find()
      .sort({ stage: 1 })
      .limit(1)
      .toArray();
    if (!nextWord) {
      return res.status(404).json({ error: "No word found" });
    }
    res.json(nextWord[0]);
  } catch (error) {
    console.error("Error fetching word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/active-word", async (req, res) => {
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
});

app.get("/api/repeat-words", async (req, res) => {
  try {
    const lengthRepeatWoorden = await repeatWoordenWoorden.countDocuments();

    if (lengthRepeatWoorden === 0) {
      const temporaryWoorden = await woorden
        .find({ status: "familiar" })
        .limit(5)
        .toArray();

      if (!temporaryWoorden) {
        return res
          .status(404)
          .json({ error: "No new words for the repeating found" });
      }

      await repeatWoorden.insertMany(
        temporaryWoorden.map((word) => ({
          wordId: word._id,
          front: word.front,
          back: word.back,
          status: word.status,
          counter: 0,
          stage: 5,
        })),
      );
    }

    const nextWord = await activeWoorden.findOne().sort({ stage: 1 });
    if (!nextWord) {
      return res.status(404).json({ error: "No word found" });
    }
    res.json(nextWord);
  } catch (error) {
    console.error("Error fetching word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/word/:id", async (req, res) => {
  try {
    const wordId = req.params.id;
    const updateData = req.body;

    if (updateData.counter === undefined && updateData.stage === undefined) {
      return res
        .status(400)
        .json({ error: "Both 'counter' and 'stage' are missing" });
    }
    // const collectionName = req.body.collection;

    // if (!collectionName) {
    //   return res.status(400).json({ error: "Collection name is required" });
    // }

    // const collection = db.collection(collectionName);

    const result = await activeWoorden.updateOne(
      { _id: new ObjectId(wordId) },
      { $set: { counter: updateData.counter || 0, stage: updateData.stage } },
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Word not updated" });
    }

    res.json({ message: "Word updated successfully" });
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/update-words", async (req, res) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    const updatedActiveWoorden = await activeWoorden.find().toArray();
    const updatedRepeatWoorden = await repeatWoorden.find().toArray();

    await Promise.all(
      updatedActiveWoorden.forEach(async (word) => {
        await woorden.updateOne(
          { _id: word.wordId },
          {
            $set: {
              status: word.status,
              counter: word.counter,
              stage: word.stage,
            },
          },
          { session },
        );
      }),
    );

    await Promise.all(
      updatedRepeatWoorden.forEach(async (word) => {
        await woorden.updateOne(
          { _id: word.wordId },
          {
            $set: {
              status: word.status,
              counter: word.counter,
              stage: word.stage,
            },
          },
          { session },
        );
      }),
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Words updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating words:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/quiz-two/:id", async (req, res) => {
  try {
    const wordId = new ObjectId(req.params.id);

    const currentWord = await activeWoorden.findOne({ _id: wordId });
    if (!currentWord) {
      return res.status(404).json({ error: "Word not found" });
    }

    const otherWords = await activeWoorden
      .aggregate([
        { $match: { _id: { $ne: wordId } } },
        { $sample: { size: 1 } },
      ])
      .toArray();

    if (otherWords.length === 0) {
      return res.status(404).json({ error: "No alternative word found" });
    }

    const wrongBack = otherWords[0].back;

    const options = [currentWord.back, wrongBack].sort(
      () => Math.random() - 0.5,
    );

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
});

app.get("/api/quiz-four/:id", async (req, res) => {
  try {
    const wordId = new ObjectId(req.params.id);
    const direction = req.query.direction || 'front-to-back';

    const currentWord = await activeWoorden.findOne({ _id: wordId });
    if (!currentWord) {
      return res.status(404).json({ error: "Word not found" });
    }

    const wrongAnswers = await activeWoorden
      .aggregate([
        { $match: { _id: { $ne: wordId } } },
        { $sample: { size: 3 } },
      ])
      .toArray();

    if (wrongAnswers.length < 3) {
      return res.status(404).json({ error: "Not enough alternative words" });
    };

    const questionField = direction === 'front-to-back' ? 'front' : 'back';
    const answerField = direction === 'front-to-back' ? 'back' : 'front';

    const incorrectOptions = wrongAnswers.map((word) => word[answerField]);
    const correctAnswer = currentWord[answerField];

    const options = [correctAnswer, ...incorrectOptions].sort(
      () => Math.random() - 0.5,
    );

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
});

app.delete("/api/clear-collections", async (req, res) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    await activeWoorden.deleteMany({}, { session });

    await repeatWoorden.deleteMany({}, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Documents deleted successfully from both collections",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.delete("/api/clear-collection", async (req, res) => {
//   const session = client.startSession();
//   try {
//     await collection.deleteMany({});
//     res.json({ message: "All documents have been deleted" });
//   } catch (error) {
//     console.error("Error deleting documents:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
