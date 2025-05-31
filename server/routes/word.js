import express from 'express';
import {
  getWords,
  updateWord,
  updateWords,
  getQuizTwo,
  getQuizFour,
  getWordById,
  getCategory
} from '../controllers/word.js';

const wordRouter = express.Router();

wordRouter.get('/category', getCategory)
wordRouter.get('/vocabulary/:id', getWords);
wordRouter.put('/update/:userId/:wordId', updateWord);
wordRouter.put('/:userId/update-words', updateWords);
wordRouter.get('/quiz-two/:userId/:wordId', getQuizTwo);
wordRouter.get('/quiz-four/:userId/:wordId', getQuizFour);
wordRouter.get('/:id', getWordById);


export default wordRouter;
