import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true,
  },
});

await client.connect(); 

const db = client.db('WoordenQuiz');
const words = db.collection('words');
const users = db.collection('users');

export default { words, users };
