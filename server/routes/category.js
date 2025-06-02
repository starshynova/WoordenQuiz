import express from 'express';
import { getCategories, setCategory } from '../controllers/category.js';

const categoryRouter = express.Router();

categoryRouter.get('/', getCategories);
categoryRouter.put('/:userId/category', setCategory)

export default categoryRouter;