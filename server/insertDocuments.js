import { MongoClient, ServerApiVersion } from "mongodb";

const words = [
  { front: "appel", back: "apple", status: "new", counter: 0, stage: 0 },
  { front: "boek", back: "book", status: "new", counter: 0, stage: 0 },
  { front: "huis", back: "house", status: "new", counter: 0, stage: 0 },
  { front: "auto", back: "car", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "deur", back: "door", status: "new", counter: 0, stage: 0 },
  { front: "raam", back: "window", status: "new", counter: 0, stage: 0 },
  { front: "tafel", back: "table", status: "new", counter: 0, stage: 0 },
  { front: "lamp", back: "lamp", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "fiets", back: "bicycle", status: "new", counter: 0, stage: 0 },
  { front: "boek", back: "book", status: "new", counter: 0, stage: 0 },
  { front: "tv", back: "tv", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "bed", back: "bed", status: "new", counter: 0, stage: 0 },
  { front: "telefoon", back: "phone", status: "new", counter: 0, stage: 0 },
  { front: "computer", back: "computer", status: "new", counter: 0, stage: 0 },
  { front: "fiets", back: "bicycle", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "kat", back: "cat", status: "new", counter: 0, stage: 0 },
  { front: "hond", back: "dog", status: "new", counter: 0, stage: 0 },
  { front: "vliegtuig", back: "airplane", status: "new", counter: 0, stage: 0 },
  { front: "boot", back: "boat", status: "new", counter: 0, stage: 0 },
  { front: "fiets", back: "bicycle", status: "new", counter: 0, stage: 0 },
  { front: "fiets", back: "bike", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "tafel", back: "table", status: "new", counter: 0, stage: 0 },
  { front: "vliegtuig", back: "airplane", status: "new", counter: 0, stage: 0 },
  { front: "auto", back: "car", status: "new", counter: 0, stage: 0 },
  { front: "deur", back: "door", status: "new", counter: 0, stage: 0 },
  { front: "huis", back: "house", status: "new", counter: 0, stage: 0 },
  { front: "school", back: "school", status: "new", counter: 0, stage: 0 },
  { front: "winkel", back: "shop", status: "new", counter: 0, stage: 0 },
  { front: "stad", back: "city", status: "new", counter: 0, stage: 0 },
  { front: "dorp", back: "village", status: "new", counter: 0, stage: 0 },
  { front: "auto", back: "car", status: "new", counter: 0, stage: 0 },
  { front: "bord", back: "board", status: "new", counter: 0, stage: 0 },
  { front: "deken", back: "blanket", status: "new", counter: 0, stage: 0 },
  { front: "oven", back: "oven", status: "new", counter: 0, stage: 0 },
  { front: "koek", back: "cookie", status: "new", counter: 0, stage: 0 },
  { front: "goud", back: "gold", status: "new", counter: 0, stage: 0 },
  { front: "regen", back: "rain", status: "new", counter: 0, stage: 0 },
  { front: "zon", back: "sun", status: "new", counter: 0, stage: 0 },
  { front: "maan", back: "moon", status: "new", counter: 0, stage: 0 },
  { front: "ster", back: "star", status: "new", counter: 0, stage: 0 },
  { front: "lucht", back: "sky", status: "new", counter: 0, stage: 0 },
  { front: "vuur", back: "fire", status: "new", counter: 0, stage: 0 },
  { front: "water", back: "water", status: "new", counter: 0, stage: 0 },
  { front: "ijs", back: "ice", status: "new", counter: 0, stage: 0 },
  { front: "koffie", back: "coffee", status: "new", counter: 0, stage: 0 },
  { front: "thee", back: "tea", status: "new", counter: 0, stage: 0 },
  { front: "bier", back: "beer", status: "new", counter: 0, stage: 0 },
  { front: "wijn", back: "wine", status: "new", counter: 0, stage: 0 },
  { front: "aarde", back: "earth", status: "new", counter: 0, stage: 0 },
  { front: "hemel", back: "heaven", status: "new", counter: 0, stage: 0 },
  { front: "milieu", back: "environment", status: "new", counter: 0, stage: 0 },
  { front: "lucht", back: "air", status: "new", counter: 0, stage: 0 },
  { front: "boom", back: "tree", status: "new", counter: 0, stage: 0 },
  { front: "bloem", back: "flower", status: "new", counter: 0, stage: 0 },
  { front: "gras", back: "grass", status: "new", counter: 0, stage: 0 },
  { front: "blad", back: "leaf", status: "new", counter: 0, stage: 0 },
  { front: "wortel", back: "root", status: "new", counter: 0, stage: 0 },
  { front: "tak", back: "branch", status: "new", counter: 0, stage: 0 },
  { front: "schaduw", back: "shadow", status: "new", counter: 0, stage: 0 },
  { front: "licht", back: "light", status: "new", counter: 0, stage: 0 },
  { front: "donker", back: "dark", status: "new", counter: 0, stage: 0 },
  { front: "stem", back: "voice", status: "new", counter: 0, stage: 0 },
  { front: "luid", back: "loud", status: "new", counter: 0, stage: 0 },
  { front: "stil", back: "silent", status: "new", counter: 0, stage: 0 },
  { front: "muziek", back: "music", status: "new", counter: 0, stage: 0 },
  { front: "dans", back: "dance", status: "new", counter: 0, stage: 0 },
  { front: "film", back: "movie", status: "new", counter: 0, stage: 0 },
  { front: "boek", back: "book", status: "new", counter: 0, stage: 0 },
  {
    front: "schilderij",
    back: "painting",
    status: "new",
    counter: 0,
    stage: 0,
  },
  { front: "tafel", back: "table", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "koek", back: "cookie", status: "new", counter: 0, stage: 0 },
  { front: "appel", back: "apple", status: "new", counter: 0, stage: 0 },
  { front: "hond", back: "dog", status: "new", counter: 0, stage: 0 },
  { front: "kat", back: "cat", status: "new", counter: 0, stage: 0 },
  { front: "auto", back: "car", status: "new", counter: 0, stage: 0 },
  { front: "deken", back: "blanket", status: "new", counter: 0, stage: 0 },
  { front: "huis", back: "house", status: "new", counter: 0, stage: 0 },
  { front: "school", back: "school", status: "new", counter: 0, stage: 0 },
  { front: "telefoon", back: "phone", status: "new", counter: 0, stage: 0 },
  { front: "computer", back: "computer", status: "new", counter: 0, stage: 0 },
  { front: "boek", back: "book", status: "new", counter: 0, stage: 0 },
  { front: "vliegtuig", back: "airplane", status: "new", counter: 0, stage: 0 },
  { front: "lamp", back: "lamp", status: "new", counter: 0, stage: 0 },
  { front: "deur", back: "door", status: "new", counter: 0, stage: 0 },
  { front: "raam", back: "window", status: "new", counter: 0, stage: 0 },
  { front: "stoel", back: "chair", status: "new", counter: 0, stage: 0 },
  { front: "fiets", back: "bicycle", status: "new", counter: 0, stage: 0 },
  { front: "vliegtuig", back: "airplane", status: "new", counter: 0, stage: 0 },
  { front: "boot", back: "boat", status: "new", counter: 0, stage: 0 },
  { front: "stad", back: "city", status: "new", counter: 0, stage: 0 },
  { front: "dorp", back: "village", status: "new", counter: 0, stage: 0 },
  { front: "luchthaven", back: "airport", status: "new", counter: 0, stage: 0 },
  { front: "straat", back: "street", status: "new", counter: 0, stage: 0 },
  { front: "gebouw", back: "building", status: "new", counter: 0, stage: 0 },
  { front: "winkel", back: "shop", status: "new", counter: 0, stage: 0 },
];

async function insertWords(db) {
  try {
    const collection = db.collection("woorden");
    await collection.insertMany(words);
    console.log("100 words inserted successfully");
  } catch (error) {
    console.error("Error inserting words:", error);
  }
}

async function run() {
  const client = new MongoClient(process.env.MONGODB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db("WoordenQuiz");
    await insertWords(db);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
