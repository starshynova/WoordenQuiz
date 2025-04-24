import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

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
const users = db.collection("users");


export default { woorden, activeWoorden, users };

