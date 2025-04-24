import express from "express";
import {
    getWords,
    getActiveWord,
    updateWord,
    updateWords,
    getQuizTwo,
    getQuizFour,
    clearCollection,
} from "../controllers/woorden.js";

const woordenRouter = express.Router();

woordenRouter.get("/", getWords);
woordenRouter.get("/active-word", getActiveWord);
woordenRouter.put("/:id", updateWord);
woordenRouter.put("/update-words", updateWords);
woordenRouter.get("/quiz-two/:id", getQuizTwo);
woordenRouter.get("/quiz-four/:id", getQuizFour);
woordenRouter.delete("/clear-collection", clearCollection);

export default woordenRouter;