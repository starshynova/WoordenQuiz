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

woordenRouter.get("/vocabulary/:id", getWords);
woordenRouter.get("/active-word", getActiveWord);
woordenRouter.put("/update/:userId/:wordId", updateWord);
woordenRouter.put("/:userId/update-words", updateWords);
woordenRouter.get("/quiz-two/:userId/:wordId", getQuizTwo);
woordenRouter.get("/quiz-four/:userId/:wordId", getQuizFour);
woordenRouter.delete("/clear-collection", clearCollection);

export default woordenRouter;