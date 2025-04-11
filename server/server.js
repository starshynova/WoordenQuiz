import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

const app = express();


app.use(cors());

dotenv.config();
const PORT = process.env.PORT;
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



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
