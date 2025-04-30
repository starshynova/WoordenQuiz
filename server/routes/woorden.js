import express from 'express';
import {
  getWords,
  updateWord,
  updateWords,
  getQuizTwo,
  getQuizFour,
} from '../controllers/woorden.js';

const woordenRouter = express.Router();

woordenRouter.get('/vocabulary/:id', getWords);
woordenRouter.put('/update/:userId/:wordId', updateWord);
woordenRouter.put('/:userId/update-words', updateWords);
woordenRouter.get('/quiz-two/:userId/:wordId', getQuizTwo);
woordenRouter.get('/quiz-four/:userId/:wordId', getQuizFour);

export default woordenRouter;
