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
const collection = db.collection("woorden");

app.use(express.json());

app.get("/api/word", async (req, res) => {
  try {
    const word = await collection.findOne({status: "new"});
    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }
    res.json(word);
  } catch (error) {
    console.error("Error fetching word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.put("/api/word/:id", async (req, res) => {
  try {
    const wordId = req.params.id;
    const updateData = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(wordId) },
      { $set: updateData }
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




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
