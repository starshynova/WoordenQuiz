import express from 'express';
import {
  createUser,
  loginUser,
  checkUserEmail,
  getUserById,
} from '../controllers/user.js';

const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.post('/check-email', checkUserEmail);
userRouter.post('/login', loginUser);
userRouter.get('/:id', getUserById);

export default userRouter;
